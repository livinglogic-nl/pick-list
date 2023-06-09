export const autoType = (strokes) => {
  if(!process.argv.includes('--auto')) { return ; }
  strokes.forEach((obj,i) => {
    setTimeout(() => {
      const payload = obj.name ? ['',obj] : [obj,{}];
      process.stdin.emit('keypress', ...payload);
    }, (i+1)*400)
  })
}

