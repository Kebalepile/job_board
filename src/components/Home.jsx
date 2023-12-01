import React,{ lazy, Suspense } from 'react';

// Use lazy() to dynamically import the components
const Main = lazy(() => import('./Main'));
const Nav = lazy(() => import('./Nav'));

export default function Home() {
  return (
    <>
      <Suspense className='loadingDiv' >
        <Main />
        <Nav />
      </Suspense>

      
    </>
  );
}