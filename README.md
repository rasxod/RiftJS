# RiftJS

RiftJS — js-фреймворк для написания изоморфных приложений со сложной бизнес-логикой и высокосвязными интерфейсами.

Основные фичи:
* удобное разделение на модули с их полной изоляцией;
* развитые способы общения модулей между собой;
* автоматизированная очистка памяти;
* реактивное программирование на всех уровнях с использованием сверхбыстрого движка;
* двунаправленный data-binding;
* роутинг с привязкой к вьюстейту и истории браузера (HTML5 history API);
* изоморфизм.

В отличии от многих современных фреймворков, в RiftJS упор сделан не на изобретение супер удобных синтаксисов на все случаи жизни, а на решение реальных проблем, возникающих при разработке сложных приложений.  
При написании фреймворка в приоритет всегда ставились максимально простые и прозрачные решения.

## 1. Начало работы

Установите gulp и bower:
```
npm install -g gulp
npm install -g bower
```

Склонируйте заготовку приложения:
```
git clone https://github.com/Riim/BlankApp.git
cd BlankApp
```

Установите модули:
```
npm install
bower install
```

Соберите и запустите приложение:
```
gulp --dev
```

Откройте в браузере `localhost:8090`

## 2. Пишем `Hello, {name}!`

Создадим карточку пользователя, принимающую экземпляр пользователя из модели приложения и выводящую приветствие для него.  
Для начала создадим класс пользователя:

Добавьте файл `App/Model/User.js` со следующим содержимым:
```js
var Rift = require('riftjs');

var User = Rift.BaseModel.extend('User', {
    /**
     * Имя пользователя.
     */
    name: Rift.$prop('')
});

module.exports = User;
```

Первый аргумент метода `extend` — имя класса — используется для разных целей, в первую очередь для передачи состояния с сервера на клиент. Имя может быть с пространством имён, например: `'2gis.ProjectName.User'`.  
`Rift.$prop` — создаёт активное свойство. Подробнее про активные свойства — [Rift.ActiveProperty](https://github.com/2gis/RiftJS/blob/master/docs/ActiveProperty.ru.md).

В файл `App/Model/Model.js` добавьте свойство `viewer` — текущий пользователь приложения. Должно получиться так:
```js
var Rift = require('riftjs');

var Model = Rift.BaseModel.extend('Model', {
    /**
     * Текущий пользователь приложения.
     * @type {User}
     */
    viewer: Rift.$prop(null)
});

module.exports = Model;
```

Теперь напишем модуль `UserCard` — карточка пользователя:

Добавьте файл `App/View/UserCard/UserCard.js` — класс карточки пользователя. Содержимое файла:
```js
var Rift = require('riftjs');

var UserCard = Rift.BaseView.extend('UserCard', {
    //
});
```

Добавьте файл `App/View/UserCard/UserCard.rtt` — шаблон карточки пользователя. Содержимое файла:
```html
<span>Hello, {model.name}!</span>
```

Соединим всё вместе:

В файле `View/Main/Main.js` наполним модель данными:
```js
var Rift = require('riftjs');

var User = require('../../Model/User.js');

var Main = Rift.BaseView.extend('View.Main', {
    receiveData: function(done) {
        this.model.viewer(new User({ name: 'Петька' }));
        done();
    }
});

module.exports = Main;
```
Так делается только для примера, по хорошему метод `receiveData` должен не записывать данные в модель, а попросить у модели подготовить нужные данные. Если данные уже есть, модель сообщает о готовности, если же нет, запрашивает их у соответствующего провайдера и сообщает о готовности после их получения. Подробнее про метод `receiveData` — [Rift.BaseView#receiveData](???).

Теперь используем модуль `UserCard` в шаблоне главного модуля (`App/View/Main/Main.rtt`):
```html
{{// используем модуль UserCard }}
{{> 'UserCard', { model: 'model.viewer()' } }}

{{// и ещё разок }}
{{> 'UserCard', { model: 'model.viewer()' } }}

{{// просто выводим имя главного пользователя без использования модуля }}
<div>{model.viewer().name}</div>
```

Обновите страницу.

Попробуйте менять имя пользователя в консоли браузера:
```js
_app.model.viewer().name('Васька');
```

Посмотрите сгенеренный сервером код.

## 3. Использование модулей

???

## 4. Создание модуля с двунаправленным связыванием данных.

???

## 5. Роутинг и вьюстейт

В классах представления доступен вьюстейт (`this.app.viewState`) — слой описывающий общее состояние представления. С этого слоя происходит маппинг состояния в url. Каждый раз, когда меняется любое поле во вьюстейте, происходит попытка подобрать более подходящий для него url-путь, и в случае успеха url обновляется. И наоборот, при переходе по локальной ссылке происходит обновление вьюстейта данными из неё. Весь этот механизм также взаимодействует с историей переходов в браузере (HTML5 history API).

В ранее склонированном приложении есть неполный пример использования этого механизма. В файле `App/routes.js` уже содержится несколько путей. Все поля использованные в `App/routes.js` автоматически создаются во вьюстейте со значением `undefined`. Если же нужно задать для поля другое значение по умолчанию, то прийдётся вручную объявить его (поле) в файле `App/viewState.js`, например так:
```js
var Rift = require('riftjs');

var $prop = Rift.$prop;

var viewState = {
    'test.value': $prop(5)
};

module.exports = viewState;
```

Через вьюстейт также можно организовывать передачу сигналов между несколькими вьюшками, но в простых случаях это лучше делать через [всплытие событий](???) (для передачи сигналов вверх) и [broadcast](???) (для передачи сигналов вниз).

В файле `App/viewState.js` не обязательно использовать в качестве значений [активные поля](???), как в примере выше, можно использовать и просто значения, при этом преобразование в [активные поля](???) будет происходить автоматически, что немного сокращает запись.

[Активные поля](???) во вьюстейте ничем не отличаются от [активных полей](???) в модели или вьюшке приложения и могут быть как зависимыми, так и выступать источником данных для других полей, в том числе находещихся не во вьюстейте. Также можно как обычно использовать такие поля в шаблонах вьюшки:
```html
<span>{app.viewState['unit.name']}</span>
```
