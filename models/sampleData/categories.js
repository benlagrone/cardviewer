var Category = require('../category');
var Category1   = Category({
    name: 'good questions',
    description:'questions with good responses'
});
Category1.save(function(err) {
  if (err) throw err;
  console.log('Category1 created!');
});
var Category2   = Category({
    name: 'difficult',
    description:'questions for good responses'
});
Category2.save(function(err) {
  if (err) throw err;
  console.log('Category1 created!');
});
var Category3   = Category({
    name: 'Programming',
    description:'questions with good responses'
});
Category3.save(function(err) {
  if (err) throw err;
  console.log('Category created!');
});
var Category4   = Category({
    name: 'personality',
    description:'questions for good responses'
});
Category4.save(function(err) {
  if (err) throw err;
  console.log('Category1 created!');
});