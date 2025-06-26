'use client';
import styles from './filter.module.css';
import Button from '../button/button';
import { Icon } from '../icon/icon';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FilterOpt } from '@/constants/types/movie';
import PanelWrapper from '../panelWrapper/panelWrapper';

type MultiFilterProps = {
  sections: FilterOpt[];
  initialSelected: Record<string, string[]>;
};

export default function Filter({
  sections,
  initialSelected,
}: MultiFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Main selected state for multi-select filters (genres, language, etc)
  const [selected, setSelected] =
    useState<Record<string, string[]>>(initialSelected);

  // Additional state for release year and rating inputs
  const [releaseYear, setReleaseYear] = useState<string>('');
  const [minRating, setMinRating] = useState<number>(0);

  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});

  // On mount, read year and rate from URL params and init state
  useEffect(() => {
    const yearParam = searchParams.get('year') || '';
    const rateParam = searchParams.get('rate') || '0';
    setReleaseYear(yearParam);
    setMinRating(Number(rateParam));
  }, [searchParams]);

  // Update URL params when filters change (selected, releaseYear, minRating)
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    // Update multi-select filters in URL
    Object.entries(selected).forEach(([key, values]) => {
      if (values.length > 0) {
        params.set(key, values.join(','));
      } else {
        params.delete(key);
      }
    });

    // Update release year param
    if (releaseYear && /^\d{4}$/.test(releaseYear)) {
      params.set('year', releaseYear);
    } else {
      params.delete('year');
    }

    // Update rating param
    if (minRating > 0) {
      params.set('rate', String(minRating));
    } else {
      params.delete('rate');
    }

    router.push(`?${params.toString()}`, { scroll: false });
  }, [selected, releaseYear, minRating, router, searchParams]);

  // Count active filters except 'all' or empty
  const activeFilterCount =
    Object.values(selected).reduce((count, arr) => {
      if (!arr || arr.length === 0) return count;
      if (arr.length === 1 && arr[0] === 'all') return count;
      return count + arr.length;
    }, 0) +
    (releaseYear ? 1 : 0) +
    (minRating > 0 ? 1 : 0);

  function handleFilterClick(
    sectionKey: string,
    optionValue: string,
    multiple: boolean
  ) {
    setSelected(prev => {
      const updated = { ...prev };
      const isSelected = updated[sectionKey]?.includes(optionValue);

      if (multiple) {
        updated[sectionKey] = isSelected
          ? updated[sectionKey].filter(v => v !== optionValue)
          : [...(updated[sectionKey] || []), optionValue];
        if (updated[sectionKey].length === 0) updated[sectionKey] = [];
      } else {
        updated[sectionKey] = isSelected ? [] : [optionValue];
      }
      return updated;
    });
  }

  function clearAllFilters() {
    const cleared: Record<string, string[]> = {};
    sections.forEach(s => {
      cleared[s.key] = [];
    });
    setSelected(cleared);
    setReleaseYear('');
    setMinRating(0);
  }

  function toggleSectionExpand(key: string) {
    setExpandedSections(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  }

  return (
    <PanelWrapper
      label='Filters'
      icon={isOpen => (
        <Icon
          name={isOpen ? 'close' : 'burger'}
          width={16}
          strokeColor='white'
        />
      )}
      badge={activeFilterCount > 0 ? activeFilterCount : 'All'}
      width='full'
      padding='lg'
    >
      <div className={styles.grid}>
        {/* Existing filter sections */}
        {sections.map(section => {
          const isLongList = section.options.length > 14;
          const expanded = expandedSections[section.key] || false;
          const optionsToShow =
            isLongList && !expanded
              ? section.options.slice(0, 14)
              : section.options;

          return (
            <div key={section.key} className={styles.section}>
              <h3>{section.title}</h3>
              <div
                className={styles.options}
                style={{
                  maxHeight: isLongList && !expanded ? undefined : 'none',
                }}
              >
                {optionsToShow.map(option => {
                  const isSelected = selected[section.key]?.includes(
                    option.value
                  );
                  return (
                    <Button
                      key={option.value}
                      variant={isSelected ? 'solid' : 'ghost'}
                      color={isSelected ? 'primary' : 'neutral'}
                      onClick={() =>
                        handleFilterClick(
                          section.key,
                          option.value,
                          !!section.multiple
                        )
                      }
                    >
                      {option.label}
                    </Button>
                  );
                })}
              </div>

              {isLongList && (
                <Button
                  type='button'
                  variant='ghost'
                  onClick={() => toggleSectionExpand(section.key)}
                  aria-expanded={expanded}
                  aria-controls={`${section.key}-options`}
                  width='100%'
                >
                  {expanded ? 'Show less ▲' : 'Show more ▼'}
                </Button>
              )}
            </div>
          );
        })}

        {/* Release Year Filter */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Release Year (From)</h3>
          <input
            type='number'
            min={1900}
            max={new Date().getFullYear()}
            placeholder='e.g. 2011'
            value={releaseYear}
            onChange={e => {
              const val = e.target.value;
              if (val === '' || /^\d{0,4}$/.test(val)) setReleaseYear(val);
            }}
            className={styles.numberInput}
          />
        </div>

        {/* Rating Filter */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Minimum Rating: {minRating}</h3>
          <input
            type='range'
            min={0}
            max={9}
            step={1}
            value={minRating}
            onChange={e => setMinRating(Number(e.target.value))}
            className={styles.sliderInput}
          />
          <div className={styles.sliderLabels}>
            <span>0</span>
            <span>9</span>
          </div>
        </div>
      </div>

      <div className={styles.divider}></div>
      <Button
        variant='ghost'
        align='center'
        color='neutral'
        width='100%'
        onClick={clearAllFilters}
      >
        ✖ Clear all filters
      </Button>
    </PanelWrapper>
  );
}
