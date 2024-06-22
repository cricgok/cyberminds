import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
    /* fonts */
    --font-satoshi-variable: 'Satoshi Variable';

    /* font sizes */
    --font-size-sm: 14px;
    --font-size-base: 16px;
    --font-size-xs: 12px;

    /* Colors */
    --color-whitesmoke-100: #ebebeb;
    --color-white: #fff;
    --color-lightgray-100: #d4d4d4;
    --color-lightgray-200: #d1d1d1;
    --color-gray: #1b1b1b;
    --color-silver: #bbb;

    /* Gaps */
    --gap-xl: 20px;
    --gap-xl-7: 20.7px;
    --gap-xl-3: 20.3px;
    --gap-29xl: 48px;
    --gap-5xl: 24px;
    --gap-3xl: 22px;
    --gap-9xs: 4px;
    --gap-sm: 14px;

    /* Paddings */
    --padding-xl: 20px;
    --padding-4xl: 23px;
    --padding-lgi: 19px;
    --padding-27xl: 46px;
    --padding-lg-9: 18.9px;
    --padding-579xl: 598px;
    --padding-280xl: 299px;
    --padding-130xl: 149px;
    --padding-sm: 14px;
    --padding-6xl: 25px;
    --padding-7xl: 26px;
    --padding-8xs-8: 4.8px;
    --padding-smi: 13px;
    --padding-8xs-9: 4.9px;
    --padding-23xl: 42px;
    --padding-21xl: 40px;
    --padding-8xl: 27px;
    --padding-lg: 18px;
    --padding-13xl: 32px;
    --padding-11xs: 2px;
    --padding-12xs: 1px;
    --padding-11xs-3: 1.3px;
    --padding-5xs: 8px;
    --padding-2xs: 11px;
    --padding-3xs: 10px;
    --padding-8xs: 5px;
    --padding-base: 16px;
    --padding-xs: 12px;

    /* Border radiuses */
    --br-7xl: 26px;
    --br-9xl-2: 28.2px;
    --br-8xl-8: 27.8px;
    --br-11xl: 30px;
    --br-3xs-1: 9.1px;
    --br-3xs: 10px;
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: var(--font-satoshi-variable), 'Arial', sans-serif;
    background-color: var(--color-whitesmoke-100);
    line-height: 1.6;

    @media (max-width: 768px) {
      font-size: var(--font-size-sm);
    }

    @media (max-width: 480px) {
      font-size: var(--font-size-xs);
    }
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0;
  }

  p {
    margin: 0 0 1em;
  }

  ul, ol {
    padding: 0;
    list-style: none;
  }

  button {
    cursor: pointer;
  }

  /* Container to provide consistent responsive padding */
  .container {
    width: 100%;
    margin-right: auto;
    margin-left: auto;
    padding-right: 15px;
    padding-left: 15px;

    @media (min-width: 576px) {
      max-width: 540px;
    }

    @media (min-width: 768px) {
      max-width: 720px;
    }

    @media (min-width: 992px) {
      max-width: 960px;
    }

    @media (min-width: 1200px) {
      max-width: 1140px;
    }
  }
`;

export default GlobalStyle;
