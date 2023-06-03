/* This file was created by inlang.
It is needed in order to circumvent a current limitation of SvelteKit. See https://github.com/inlang/inlang/issues/647
You can remove this comment and modify the file as you like. We just need to make sure it exists.
Please do not delete it (inlang will recreate it if needed). */

// From josh collins blog tutorial
// "Just as +layout.svelte renders every page on the site, 
// "+layout.js loads on every page."

// see: https://github.com/sveltejs/kit/discussions/3365
// [NB] WITHOUT this, run through server, where no access to window object
//      result: get a 500 -- server error
export const ssr = false;


export const load = ({ url }) => {
  const currentRoute = url.pathname

  // console.log(`currentRoute: ${currentRoute}`)

  return {
    currentRoute
  }
}
