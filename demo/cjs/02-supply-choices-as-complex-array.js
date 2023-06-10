(async() => {
  const { pickList } = await import('../../dist/cjs/index.js')
  const { autoType } = await import('../auto-type.mjs')
  
  autoType([
    { name:'down' },
    { name:'down' },
    's',
    { name:'return' },
  ]);
  
  try {
    const answer = await pickList('favourite food', [
      { foodName:'pizza' },
      { foodName:'sushi' },
      { foodName:'spaghetti' },
      { foodName:'lasagna' },
      { foodName:'babi pangang' },
    ], 'foodName');
    console.log(answer); // { foodName: 'sushi' }
  } catch(e) {
  }
  
})()