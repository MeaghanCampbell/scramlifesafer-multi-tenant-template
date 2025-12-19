/**
 * Container Component
 * -------------------
 * Wraps content in a max-width layout with optional background color and image.
 */

import React, { ReactNode } from 'react';

type ContainerProps = {
    children: ReactNode;
    backgroundColor?: string;
    backgroundImage?: string | { url?: string };
    className?: string;
  };
  export const Container: React.FC<ContainerProps> = ({
    children,
    backgroundColor = 'bg-white',
    backgroundImage,
    className = '',
  }) => {

    const imageUrl =
    typeof backgroundImage === 'string'
      ? backgroundImage
      : backgroundImage?.url;

    const backgroundStyle = imageUrl
        ? {
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }
        : {};

    const hasImage = Boolean(imageUrl);

    const relative = hasImage ? 'relative' : ''

    return (
        <section className={`${backgroundColor} ${className} ${relative}`} style={backgroundStyle}>
            <div className={`${relative} z-10 max-w-content mx-auto px-6 sm:px-8`}>
                {children}
            </div>
        </section>
    )

  }