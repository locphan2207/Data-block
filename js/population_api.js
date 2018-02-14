export const getPopulation = (year, age) => {
  return $.ajax({
    url: `http://api.population.io:80/1.0/population/${year}/aged/${age}/`
  });
};
