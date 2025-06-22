import { ReactNode } from 'react';
import BannerDisplay from './banner-display';

interface PageBannerWrapperProps {
  children: ReactNode;
  page: string;
  className?: string;
}

export function PageBannerWrapper({ children, page, className = '' }: PageBannerWrapperProps) {
  return (
    <div className={className}>
      {/* Header Banner */}
      <BannerDisplay position="header" page={page} />
      
      {/* Content Top Banner */}
      <BannerDisplay position="content-top" page={page} />
      
      {/* Main Content */}
      {children}
      
      {/* Content Bottom Banner */}
      <BannerDisplay position="content-bottom" page={page} />
      
      {/* Footer Banner */}
      <BannerDisplay position="footer" page={page} />
    </div>
  );
}

export default PageBannerWrapper;