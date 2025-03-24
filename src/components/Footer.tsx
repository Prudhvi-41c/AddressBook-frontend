import * as React from 'react';

interface IFooterProps {}

const Footer: React.FunctionComponent<IFooterProps> = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-200 py-4 my-2 px-8 text-center mt-auto">
      <p className="text-gray-700 text-sm">
        &copy; {currentYear} All rights reserved | Cimpress India
      </p>
    </footer>
  );
};

export default Footer;
