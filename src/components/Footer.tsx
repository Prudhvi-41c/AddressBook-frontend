import * as React from 'react';

interface IFooterProps {}

const Footer: React.FunctionComponent<IFooterProps> = (props) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 py-4 px-8 text-center">
      <p className="text-gray-700">
        &copy; {currentYear} Prudhvi. All rights reserved. | Cimpress India
      </p>
    </footer>
  );
};

export default Footer;