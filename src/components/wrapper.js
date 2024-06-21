import React, { useEffect } from 'react';

const withBodyClass = (PageComponent, className) => {
  return (props) => {
    useEffect(() => {
      document.body.classList.add(className);

      return () => {
        document.body.classList.remove(className);
      };
    }, [className]);

    return <PageComponent {...props} />;
  };
};

export default withBodyClass;
