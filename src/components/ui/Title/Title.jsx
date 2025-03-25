'use client';
import React from 'react';
import styles from './Title.module.scss';

const Title = ({ as: Component = 'h1', children, className = '', ...props }) => {
    return (
        <Component className={`${styles.title} ${className}`} {...props}>
            {children}
        </Component>
    );
};

export default Title;
