import React from 'react';

function ProductContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2  min-[480px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {children}
    </div>
  );
}

export default ProductContainer;
