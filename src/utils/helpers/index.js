export const setPenugasanValue = (value) => {
  switch(value) {
    case 'LMO':
      return 'Area Tambang LMO';
    case 'BMO':
      return 'Area Tambang BMO';
    case 'BMO I':
      return 'Area Tambang BMO I';
    case 'BMO II':
      return 'Area Tambang BMO II';
    case 'SMO':
      return 'Area Tambang SMO';
    case 'BEE':
      return 'Area Tambang BEE';
    case 'GMO':
      return 'Area Tambang GMO';
    default:
      return 'Area Tambang LMO';
  }
}

export const findWmpDetail = (id, wmp) => {
  console.log('ID WMP: ', id);
  console.log('DATA WMP: ', wmp);
  return wmp.find(key => key.id === id);
}