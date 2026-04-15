import axios from "axios";

async function getNameNationality(nameParams) {
  const response = await axios.get(
    `${process.env.NATIONALIZE_API_URL}?name=${nameParams}`
  );

  const { country } = response.data;

  if (country.length === 0) {
    const error = new Error("Nationalize API did not return a valid nationality prediction for the provided name");
    error.statusCode = 502;
    throw error;
  }

  let countryWithHighestProbability = 0;
  let predictedCountry = "";

  country.forEach((item) => {
    if (item.probability > countryWithHighestProbability) {
      countryWithHighestProbability = item.probability;
      predictedCountry = item.country_id;
    }
  });

  return {
    countryId: predictedCountry,
    probability: countryWithHighestProbability
  };
}

export default getNameNationality;