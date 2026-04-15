import axios from "axios";

async function getNameAge(nameParams) {
  const response = await axios.get(
    `${process.env.AGIFY_API_URL}?name=${nameParams}`
  );

  const { age } = response.data;

  if (age === null) {
    const error = new Error("Agify API did not return a valid age prediction for the provided name");
    error.statusCode = 502;
    throw error;
  }

  let ageGroup;

  if (age >= 0 && age <= 12) {
    ageGroup = "child";
  } else if (age >= 13 && age <= 19) {
    ageGroup = "teenager";
  } else if (age >= 20 && age <= 59) {
    ageGroup = "adult";
  } else {
    ageGroup = "senior";
  }

  return { age, ageGroup };
}

export default getNameAge;