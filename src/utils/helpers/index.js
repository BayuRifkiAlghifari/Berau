export const setPenugasanValue = (value) => {
  switch(value) {
    case 'LMO':
      return 'Area Tambang LMO';
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