import React from 'react';

function ShopProductContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 min-[480px]:grid-cols-3 xl:grid-cols-4 gap-6">
      {children}
    </div>
  );
}

export default ShopProductContainer;
