/**
 * @description use share Web Api to enable enduser to share certain data 
 * relating to the site.
 * @param {object} data 
 */
export default async function Share(data){
    try {
        await navigator.share(data);
      } catch (err) {
        console.error(err);
      }
}