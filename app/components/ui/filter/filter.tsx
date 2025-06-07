'use client';
import styles from './filter.module.css';
import Button from '../button/button';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FilterOpt } from '@/app/constants/types/movie';

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
  const [showFilters, setShowFilters] = useState(false);

  // State to track expanded sections (for show more / less)
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(selected).forEach(([key, values]) => {
      if (values.length > 0) {
        params.set(key, values.join(','));
      } else {
        params.delete(key);
      }
    });
    router.push(`?${params.toString()}`);
  }, [selected, router, searchParams]);

  // Count of selected filters excluding 'all' or empty
  const activeFilterCount = Object.values(selected).reduce((count, arr) => {
    if (!arr || arr.length === 0) return count;
    if (arr.length === 1 && arr[0] === 'all') return count;
    return count + arr.length;
  }, 0);

  function handleFilterClick(
    sectionKey: string,
    optionValue: string,
    multiple: boolean
  ) {
    setSelected(prev => {
      const updated = { ...prev };
      const isSelected = updated[sectionKey]?.includes(optionValue);

      if (multiple) {
        // Toggle option in array
        updated[sectionKey] = isSelected
          ? updated[sectionKey].filter(v => v !== optionValue)
          : [...(updated[sectionKey] || []), optionValue];
        // If none selected after removing, reset to empty array
        if (updated[sectionKey].length === 0) updated[sectionKey] = [];
      } else {
        // Single select: if already selected, clear, else set
        updated[sectionKey] = isSelected ? [] : [optionValue];
      }

      return updated;
    });
  }

  function clearAllFilters() {
    const cleared = {} as Record<string, string[]>;
    sections.forEach(s => {
      cleared[s.key] = [];
    });
    setSelected(cleared);
  }

  function toggleSectionExpand(key: string) {
    setExpandedSections(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  }

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.toggleButton}
        aria-label='Toggle Filters'
        onClick={() => setShowFilters(prev => !prev)}
      >
        <span className={styles.toggleIcon}>{showFilters ? '✖' : '☰'}</span>
        Filters
        <span className={styles.countBadge}>
          {activeFilterCount > 0 ? activeFilterCount : 'All'}
        </span>
      </button>

      {showFilters && (
        <div
          className={styles.filterPanel}
          role='region'
          aria-label='Filter Options'
        >
          <div className={styles.grid}>
            {sections.map(section => {
              const isLongList = section.options.length > 14;
              const expanded = expandedSections[section.key] || false;
              const optionsToShow =
                isLongList && !expanded
                  ? section.options.slice(0, 14)
                  : section.options;

              return (
                <div key={section.key} className={styles.section}>
                  <h3 className={styles.sectionTitle}>{section.title}</h3>
                  <div
                    className={styles.options}
                    // If using scroll, maxHeight is set in CSS. Show more disables the slice, so no scrolling needed.
                    style={{
                      maxHeight: isLongList && !expanded ? undefined : 'none',
                    }}
                  >
                    {optionsToShow.map(option => {
                      const isSelected = selected[section.key]?.includes(
                        option.value
                      );
                      return (
                        <button
                          key={option.value}
                          type='button'
                          className={`${styles.optionButton} ${
                            isSelected ? styles.optionSelected : ''
                          }`}
                          onClick={() =>
                            handleFilterClick(
                              section.key,
                              option.value,
                              !!section.multiple
                            )
                          }
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>

                  {isLongList && (
                    <button
                      type='button'
                      className={styles.showMoreButton}
                      onClick={() => toggleSectionExpand(section.key)}
                      aria-expanded={expanded}
                      aria-controls={`${section.key}-options`}
                    >
                      {expanded ? 'Show less ▲' : 'Show more ▼'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className={styles.clearWrapper}>
            <button
              className={styles.clearButton}
              type='button'
              onClick={clearAllFilters}
            >
              ✖ Clear all filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
