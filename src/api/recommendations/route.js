async function handler({ supplements, schedule, expectedResults, warnings }) {
  if (!supplements?.length || !schedule?.length || !expectedResults) {
    return { error: "Missing required fields" };
  }

  try {
    const result = await sql`
      INSERT INTO recommendations 
        (supplements, schedule, recommendation_text, warnings, created_at) 
      VALUES 
        (${supplements}, ${JSON.stringify(
      schedule
    )}, ${expectedResults}, ${warnings}, CURRENT_TIMESTAMP) 
      RETURNING *
    `;

    return {
      success: true,
      data: result[0],
      message: "Recommendations saved successfully",
    };
  } catch (error) {
    return { error: error.message };
  }
}