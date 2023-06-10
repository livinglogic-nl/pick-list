(async() => {
  const { pickList } = await import('../../dist/cjs/index.js')
  const { autoType } = await import('../auto-type.mjs')
  
  autoType([
    'n', 'g',
    { name:'return' },
  ]);
  
  try {
    const answer = await pickList('favourite food', [
      'pizza',
      'sushi',
      'spaghetti',
      'lasagna',
      'babi pangang',
    ]);
    console.log(answer); // babi pangang
  } catch(e) {
  }
  
})()