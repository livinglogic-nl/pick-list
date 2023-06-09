interface FuzzyOptions {
  needle:string;
  choices:any[];
  labelField:string;
}

export const fuzzy = (options:FuzzyOptions) => {
  const labelField = options.labelField;
  const letters = options.needle.split('');

  const candidates = options.choices.map(choice => {
    const label = choice[labelField].toLowerCase();
    let score = 0;
    let next = 0;
    const indexes = [];
    for(let i=0; i<letters.length; i++) {
      const idx = label.indexOf(letters[i], next);
      if(idx === -1) {
        return null;
      }
      indexes.push(idx);
      if(next !== 0) {
        score += (idx === next) ? 2 : 1;
      }
      next = idx+1;
    }
    return {
      label,
      indexes,
      choice,
      score,
    }
  }).filter(candidate => candidate != null)
  return candidates
    .sort((a,b) => b.score - a.score)
} 
