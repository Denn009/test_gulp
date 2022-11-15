ymaps.ready(init);

function init(){

  const myMap = new ymaps.Map("map", {
    center: [59.94090776, 30.28289075],

    zoom: 13
  });

  // Создаем геообъект с типом геометрии "Точка".
  myGeoObject = new ymaps.GeoObject({

  })
  myMap.geoObjects
    .add(new ymaps.Placemark([59.94090776, 30.28289075], {
      balloonContent: '<strong>Мы находимся здесь</strong>'
    }, {
      preset: 'islands#dotIcon',
      iconColor: 'red'
    }))
}
