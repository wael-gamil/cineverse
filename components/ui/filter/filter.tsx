'use client';
import styles from './filter.module.css';
import Button from '../button/button';
import { Icon } from '../icon/icon';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FilterOpt } from '@/constants/types/movie';
import PanelWrapper from '../panelWrapper/panelWrapper';
import { useResetPageOnParamChange } from '@/hooks/useResetPageOnParamChange';

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

  const [selected, setSelected] =
    useState<Record<string, string[]>>(initialSelected);

  const [debouncedYear, setDebouncedYear] = useState('');
  const [debouncedRating, setDebouncedRating] = useState(0);

  const [closePanel, setClosePanel] = useState<() => void>(() => () => {});
  useResetPageOnParamChange([
    'genres',
    'year',
    'rate',
    'lang',
    'sortBy',
    'order',
  ]);
  // Debounce year input
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedYear(selected.year?.[0] || '');
    }, 800);
    return () => clearTimeout(timeout);
  }, [selected.year]);

  // Debounce rating input
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedRating(Number(selected.rate?.[0] || 0));
    }, 400);
    return () => clearTimeout(timeout);
  }, [selected.rate]);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const genreValues = selected.genres || [];
    const langValues = selected.lang || [];

    if (genreValues.length > 0) {
      params.set('genres', genreValues.join(','));
    } else {
      params.delete('genres');
    }

    if (langValues.length > 0) {
      params.set('lang', langValues.join(','));
    } else {
      params.delete('lang');
    }
    if (debouncedYear && /^\d{4}$/.test(debouncedYear)) {
      params.set('year', debouncedYear);
    } else {
      params.delete('year');
    }

    if (debouncedRating > 0) {
      params.set('rate', String(debouncedRating));
    } else {
      params.delete('rate');
    }
    router.push(`?${params.toString()}`, { scroll: false });
    setTimeout(() => {
      closePanel();
    }, 200);
  }, [selected.genres, selected.lang, debouncedYear, debouncedRating]);

  const activeFilterCount = Object.entries(selected).reduce(
    (count, [key, arr]) => {
      if (!arr || arr.length === 0) return count;
      if (arr.length === 1 && arr[0] === 'all') return count;
      return count + arr.length;
    },
    0
  );

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
    cleared['year'] = [];
    cleared['rate'] = [];
    setSelected(cleared);
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
      setClose={setClosePanel}
    >
      <div className={styles.grid}>
        {sections.map(section => {
          const isLongList = section.options.length > 14;
          const optionsToShow = isLongList
            ? section.options.slice(0, 14)
            : section.options;

          return (
            <div key={section.key} className={styles.section}>
              <h3>{section.title}</h3>
              <div
                className={styles.options}
                style={{ maxHeight: isLongList ? undefined : 'none' }}
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
            </div>
          );
        })}

        {/* Release Year */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Release Year (From)</h3>
          <input
            type='number'
            min={1900}
            max={new Date().getFullYear()}
            placeholder='e.g. 2011'
            value={selected.year?.[0] || ''}
            onChange={e => {
              const val = e.target.value;
              if (val === '' || /^\d{0,4}$/.test(val)) {
                setSelected(prev => ({
                  ...prev,
                  year: val ? [val] : [],
                }));
              }
            }}
            className={styles.numberInput}
          />
        </div>

        {/* Rating */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            Minimum Rating: {selected.rate?.[0] || 0}
          </h3>
          <input
            type='range'
            min={0}
            max={9}
            step={1}
            value={Number(selected.rate?.[0] || 0)}
            onChange={e =>
              setSelected(prev => ({
                ...prev,
                rate: [e.target.value],
              }))
            }
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
