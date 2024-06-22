const db = require('../config/database');

exports.getUserStatistics = (req, res) => {
  const { userId } = req.params;
  const query = `
    SELECT 
      overallQuestionsAttempted AS total_questions_attempted,
      overallCorrectAnswers AS total_correct_answers,
      (overallQuestionsAttempted - overallCorrectAnswers) AS total_incorrect_answers
    FROM users
    WHERE id = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching user statistics:', err);
      return res.status(500).send({ success: false, message: 'Failed to fetch statistics' });
    }
    if (results.length > 0) {
      res.send({ success: true, statistics: results[0] });
    } else {
      res.status(404).send({ success: false, message: 'User not found' });
    }
  });
};
