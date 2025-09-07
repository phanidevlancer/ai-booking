import React, { forwardRef, useEffect, useRef, useState } from 'react';

// Shared element transition registry
class SharedElementRegistry {
  private static instance: SharedElementRegistry;
  private elements = new Map<string, HTMLElement>();
  private transitions = new Map<string, any>();

  static getInstance(): SharedElementRegistry {
    if (!SharedElementRegistry.instance) {
      SharedElementRegistry.instance = new SharedElementRegistry();
    }
    return SharedElementRegistry.instance;
  }

  registerElement(tag: string, element: HTMLElement) {
    this.elements.set(tag, element);
  }

  unregisterElement(tag: string) {
    this.elements.delete(tag);
  }

  getElement(tag: string): HTMLElement | undefined {
    return this.elements.get(tag);
  }

  startTransition(tag: string, fromElement: HTMLElement, toElement: HTMLElement) {
    const fromRect = fromElement.getBoundingClientRect();
    const toRect = toElement.getBoundingClientRect();

    // Create floating shared element
    const sharedElement = document.createElement('div');
    sharedElement.innerHTML = fromElement.outerHTML;
    sharedElement.style.cssText = `
      position: fixed;
      top: ${fromRect.top}px;
      left: ${fromRect.left}px;
      width: ${fromRect.width}px;
      height: ${fromRect.height}px;
      z-index: 99999;
      pointer-events: none;
      will-change: transform, opacity, border-radius, box-shadow;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    `;
    sharedElement.setAttribute('data-shared-element-floating', tag);
    
    document.body.appendChild(sharedElement);

    // Hide original elements
    fromElement.style.opacity = '0';
    toElement.style.opacity = '0';

    // Use Web Animations API for spring-like animation
    const animation = sharedElement.animate([
      {
        top: `${fromRect.top}px`,
        left: `${fromRect.left}px`,
        width: `${fromRect.width}px`,
        height: `${fromRect.height}px`,
        transform: 'scale(1)',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
      },
      {
        top: `${fromRect.top + (toRect.top - fromRect.top) * 0.6}px`,
        left: `${fromRect.left + (toRect.left - fromRect.left) * 0.6}px`,
        width: `${fromRect.width + (toRect.width - fromRect.width) * 0.6}px`,
        height: `${fromRect.height + (toRect.height - fromRect.height) * 0.6}px`,
        transform: 'scale(1.02)',
        borderRadius: '6px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)'
      },
      {
        top: `${toRect.top}px`,
        left: `${toRect.left}px`,
        width: `${toRect.width}px`,
        height: `${toRect.height}px`,
        transform: 'scale(1)',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
      }
    ], {
      duration: 600,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Spring-like easing
      fill: 'forwards'
    });

    // Complete transition when animation finishes
    animation.addEventListener('finish', () => {
      toElement.style.opacity = '1';
      sharedElement.remove();
    });
  }
}

interface AnimatedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  sharedTransitionTag?: string;
  sharedTransitionStyle?: any;
}

export const AnimatedImage = forwardRef<HTMLImageElement, AnimatedImageProps>(
  ({ sharedTransitionTag, sharedTransitionStyle, className = '', ...props }, ref) => {
    const elementRef = useRef<HTMLImageElement>(null);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
      const element = elementRef.current;
      if (element && sharedTransitionTag) {
        const registry = SharedElementRegistry.getInstance();
        registry.registerElement(sharedTransitionTag, element);

        return () => {
          registry.unregisterElement(sharedTransitionTag);
        };
      }
    }, [sharedTransitionTag]);

    // Handle shared element transition detection
    useEffect(() => {
      if (sharedTransitionTag) {
        const handleTransition = () => {
          const registry = SharedElementRegistry.getInstance();
          const existingElement = registry.getElement(sharedTransitionTag);
          const currentElement = elementRef.current;

          if (existingElement && currentElement && existingElement !== currentElement) {
            registry.startTransition(sharedTransitionTag, existingElement, currentElement);
          }
        };

        // Check for transitions after component mounts
        const timer = setTimeout(handleTransition, 100);
        return () => clearTimeout(timer);
      }
    }, [sharedTransitionTag]);

    return (
      <img
        {...props}
        ref={(node) => {
          elementRef.current = node;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className={`${className} transition-opacity duration-500`}
        style={{
          opacity: isVisible ? 1 : 0,
          ...props.style
        }}
        data-shared-transition-tag={sharedTransitionTag}
      />
    );
  }
);

AnimatedImage.displayName = 'AnimatedImage';

// Export the Animated namespace like React Native Reanimated
export const Animated = {
  Image: AnimatedImage,
};

export default Animated;