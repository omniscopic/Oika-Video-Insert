/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

var fruitSelector = document.getElementById('fruit');
var vegetableSelector = document.getElementById('vegetable');

t.render(function(){
  return Promise.all([
    t.get('board', 'shared', 'fruit'),
    t.get('board', 'private', 'vegetable')
  ])
  .spread(function(savedFruit, savedVegetable){
    if(savedFruit && /[a-z]+/.test(savedFruit)){
      fruitSelector.value = savedFruit;
    }
    if(savedVegetable && /[a-z]+/.test(savedVegetable)){
      vegetableSelector.value = savedVegetable;
    }
  })
  .then(function(){
    t.sizeTo('#content')
    .done();
  })
});

document.getElementById('submitURL').addEventListener('click', function(){
  var url = document.getElementById('ytURL').value;
  return t.set('card', 'private', 'url', url)
  .then(function(){
    t.closePopup();
  })
})
