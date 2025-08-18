'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import FilterTabs from '../filter/filterTabs';

type OrderValue = 'ASC' | 'DESC';

type OrderTabsProps = {
  initialOrder?: OrderValue;
};

export default function OrderTabs({ initialOrder = 'DESC' }: OrderTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<OrderValue>(initialOrder);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (order) {
      params.set('order', order);
    } else {
      params.delete('order');
    }
    router.push(`?${params.toString()}`, { scroll: false });
  }, [order]);

  return (
    <FilterTabs<OrderValue>
      options={[
        {
          label: '↑ Asc',
          value: 'ASC',
          title: 'Ascending order',
        },
        {
          label: '↓ Desc',
          value: 'DESC',
          title: 'Descending order',
        },
      ]}
      active={order}
      onChange={setOrder}
    />
  );
}
