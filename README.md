Проектная работа "Веб-ларек"
https://github.com/fonary/weblarek.git

Стек: HTML, SCSS, TS, Vite

Структура проекта:
src/ — исходные файлы проекта
src/components/ — папка с JS компонентами
src/components/base/ — папка с базовым кодом

Важные файлы:
index.html — HTML-файл главной страницы
src/types/index.ts — файл с типами
src/main.ts — точка входа приложения
src/scss/styles.scss — корневой файл стилей
src/utils/constants.ts — файл с константами
src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```
или
```
yarn
yarn dev
```

## Сборка
```
npm run build
```
или
```
yarn build
```

# Интернет-магазин «Web-Larёk»

«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:
- **Model** - слой данных, отвечает за хранение и изменение данных.
- **View** - слой представления, отвечает за отображение данных на странице.
- **Presenter** - презентер содержит основную логику приложения и отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

## Базовый код

### Класс Component

Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:
- `container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:
- `render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.
- `setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`

### Класс Api

Содержит в себе базовую логику отправки запросов.

Конструктор:
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:
- `baseUrl: string` - базовый адрес сервера
- `options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:
- `get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.
- `handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

### Класс EventEmitter

Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:
- `_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:
- `on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.
- `emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.
- `trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

## Данные

### Интерфейс Product

Описывает товар, отображаемый в каталоге и корзине покупок.

Поля:
- `id: string` - Уникальный идентификатор товара
- `title: string` - Название товара
- `image: string` - URL изображения товара
- `category: string` - Категория товара
- `price: number | null` - Цена товара
- `description: string` - Описание товара

### Интерфейс Customer

Описывает данные покупателя для оформления заказа.

Поля:
- `payment: Payment` - Способ оплаты
- `address: string` - Адрес доставки
- `email: string` - Электронная почта покупателя
- `phone: string` - Телефон покупателя

### Интерфейс OrderRequest

Описывает данные для отправки заказа на сервер.

Поля:
- `payment: Payment` - Способ оплаты
- `address: string` - Адрес доставки
- `email: string` - Email покупателя
- `phone: string` - Телефон покупателя
- `total: number` - Общая сумма заказа
- `items: string[]` - Массив id товаров

### Интерфейс OrderResponse

Описывает ответ сервера при успешном оформлении заказа.

Поля:
- `id: string` - Уникальный идентификатор заказа
- `total: number` - Общая сумма заказа

## Модели данных

### Класс CatalogModel

Отвечает за хранение и загрузку списка товаров, а также хранение текущего выбранного товара.

Конструктор:
`constructor(events: IEvents)` - принимает брокер событий для уведомления об изменении данных.

Поля:
- `private productsList: Product[]` - Массив товаров для каталога
- `private chosenProduct: Product | null` - Текущий выбранный товар

Методы:
- `set products(products: Product[])` - Сохранить список товаров. **Эмитит событие `items:changed`.**
- `get products(): Product[]` - Получить список товаров
- `set selectedProduct(id: string): void` - Сохранить текущий выбранный товар. **Эмитит событие `preview:changed`.**
- `get selectedProduct(): Product | null` - Получить текущий выбранный товар
- `getProductById(id: string): Product | null` - Получить товар из списка товаров по ID.

### Класс CartModel

Отвечает за управление товарами, которые пользователь выбрал для покупки. Позволяет хранить, добавлять, удалять и подсчитывать товары добавленные пользователем.

Конструктор:
`constructor(events: IEvents)` - принимает брокер событий для уведомления об изменении содержимого корзины.

Поля:
- `private products: Product[]` - Список товаров добавленных в корзину

Методы:
- `getProducts(): Product[]` - Получить список добавленных товаров
- `addProduct(product: Product): void` - Добавить товар из параметра в список товаров. **Эмитит событие `basket:changed`.**
- `deleteProduct(product: Product): void` - Удалить товар из параметра из списка товаров. **Эмитит событие `basket:changed`.**
- `deleteAll(): void` - Удалить все товары из списка товаров. **Эмитит событие `basket:changed`.**
- `getTotalAmount(): number` - Получить общую стоимость товаров в списке
- `getProductCount(): number` - Получить количество товаров в списке
- `isProductInCart(id: string): boolean` - Проверить наличие товара в списке, по его id

### Класс CustomerModel

Отвечает за хранение, управление и валидацию данными покупателя.

Конструктор:
`constructor(events: IEvents)` - принимает брокер событий для уведомления об изменении данных заказа.

Поля:
- `private paymentType: Payment | null` - Способ оплаты
- `private addressDelivery: string` - Адрес доставки
- `private emailCustomer: string` - Электронная почта
- `private phoneCustomer: string` - Номер телефона

Методы:
- `set payment(payment: Payment | null)` - Устанавливает способ оплаты. **Эмитит событие `order:changed`.**
- `set address(address: string)` - Устанавливает адрес покупателя. **Эмитит событие `order:changed`.**
- `set email(email: string)` - Устанавливает емэйл покупателя. **Эмитит событие `order:changed`.**
- `set phone(phone: string)` - Устанавливает телефон покупателя. **Эмитит событие `order:changed`.**
- `getCustomer(): Customer` - Получить данные покупателя
- `clear(): void` - Очистить данные покупателя. **Эмитит событие `order:changed`.**
- `validate(): CustomerErrors` - Валидировать поля и вернуть объект с текстом ошибок, где ключ - поле, а значение - текст ошибки. Если ошибок нет, вернуть пустой объект.

## Слой коммуникации

### Класс ClientApi

Отвечает за взаимодействие с сервером.
Предоставляет методы для загрузки товаров и оформления заказа.

Конструктор:
`constructor(api: IApi)` - Принимает экземпляр класса `Api`, реализующего интерфейс `IApi`

Поля класса:
- `private api: IApi` - Ссылка на объект, обеспечивающий выполнение запросов.

Методы класса:
- `getProducts(): Promise<ProductsResponse>` - делает GET запрос на эндпоинт `/product` и возвращает объект, полученный от сервера, в котором находится массив товаров.
- `placeOrder(order: OrderRequest): Promise<OrderResponse>` - делает POST запрос на эндпоинт `/order/` и передаёт в него данные, полученные в параметрах метода, а возвращает объект, подтверждающий покупку на определенную сумму.

## View компоненты

### Интерфейсы

#### Интерфейс HeaderData
Описывает данные для компонента `HeaderView`.

Поля:
- `counter: number` - количество товаров в корзине.

#### Интерфейс GalleryData
Описывает данные для компонента `Gallery`.

Поля:
- `catalog: HTMLElement[]` - массив DOM-элементов карточек товаров для отображения.

#### Интерфейс ModalData
Описывает данные для компонента `Modal`.

Поля:
- `hidden: boolean` - состояние видимости модального окна.
- `content: HTMLElement` - DOM-элемент, который будет отображён внутри модального окна.

#### Интерфейс SuccessViewData
Описывает данные для компонента `SuccessView`.

Поля:
- `amount: number` - сумма списания.

#### Интерфейс BasketViewData
Описывает данные для компонента `Basket`.

Поля:
- `purchases: HTMLElement[]` - массив DOM-элементов товаров в корзине
- `totalCost: number` - общая стоимость корзины.

#### Тип CardCatalogData
Описывает данные для карточек в каталоге.

Поля:
- `id: string` - Уникальный идентификатор товара
- `title: string` - Название товара
- `price: number | null` - Цена товара
- `category: string` - Категория товара
- `image: string` - Данные изображения

#### Тип CardPreviewData
Описывает данные для карточки в модальном окне предпросмотра. Использует интерфейс `Product`.

Поля:
- `id: string` - Уникальный идентификатор товара
- `title: string` - Название товара
- `price: number | null` - Цена товара
- `category: string` - Категория товара
- `image: string` - Данные изображения
- `description: string` - Описание товара

#### Тип CardBasketData
Описывает данные для карточки в корзине.

Поля:
- `id: string` - Уникальный идентификатор товара
- `title: string` - Название товара
- `price: number | null` - Цена товара
- `index: number` - Порядковый номер товара в корзине

#### Тип FormState
Описывает состояние UI формы.

Поля:
- `valid: boolean` - валидность формы
- `error?: CustomerErrors` - объект с ошибками валидации

#### Тип OrderFormData
Тип для данных формы заказа.

Поля:
- `payment: Payment | null` - способ оплаты («cash» или «online»)
- `address: string` - адрес доставки
- `valid: boolean` - валидность формы
- `error?: CustomerErrors` - объект с ошибками валидации

#### Тип ContactsFormData
Тип для данных формы контактов.

Поля:
- `email: string` - email пользователя
- `phone: string` - телефон пользователя
- `valid: boolean` - валидность формы
- `error?: CustomerErrors` - объект с ошибками валидации

### Класс HeaderView

Класс для отображения и управления элементами шапки приложения.
Является дочерним классом `Component<HeaderData>`.

Конструктор:
`constructor(container: HTMLElement, events: IEvents)` - принимает ссылку на DOM-элемент шапки и брокер событий.

Поля класса:
- `basketButton: HTMLButtonElement` - кнопка открытия корзины
- `counterEl: HTMLElement` - элемент отображения количества товаров в корзине.

Слушатели событий (устанавливаются в конструкторе):
- `click` на `basketButton` - **эмитит событие `basket:open`**.

Сеттеры:
- `set counter(value: number): void` - устанавливает количество товаров в корзине в элемент `counterEl`.

### Класс GalleryView

Класс для отображения списка товаров в каталоге.
Является дочерним классом `Component<GalleryData>`.

Конструктор:
`constructor(container: HTMLElement)` - принимает ссылку на DOM-элемент контейнера каталога.

Слушатели событий: отсутствуют (класс не содержит пользовательских действий — клики по карточкам обрабатываются в `CardCatalogView`).

Сеттеры:
- `set catalog(items: HTMLElement[]): void` - принимает массив DOM-элементов карточек и добавляет их в `this.container`.

### Класс ModalView

Класс для отображения и управления модального окна.
Является дочерним классом `Component<ModalData>`.

Конструктор:
`constructor(container: HTMLElement, events: IEvents)` - принимает ссылку на DOM-элемент модального окна и брокер событий.

Поля класса:
- `modalButton: HTMLButtonElement` - кнопка закрытия модального окна
- `modalContentEl: HTMLElement` - контейнер для встраиваемого контента

Слушатели событий (устанавливаются в конструкторе):
- `click` на `modalButton` - **эмитит событие `modal:close`**.
- `click` на `container` (оверлей) - **эмитит событие `modal:close`**, если клик произошёл вне контента.

Сеттеры:
- `set hidden(value: boolean): void` - управляет видимостью модального окна через класс `modal_active`.
- `set content(child: HTMLElement): void` - устанавливает переданный DOM-элемент как содержимое модального окна.

### Класс SuccessView

Класс для отображения успешного оформления заказа.
Является дочерним классом `Component<SuccessViewData>`.

Конструктор:
`constructor(container: HTMLElement, events: IEvents)` - принимает ссылку на DOM-элемент контейнера success-сообщения и брокер событий.

Поля класса:
- `closeButton: HTMLButtonElement` - кнопка закрытия окна
- `debitEl: HTMLElement` - элемент отображения информации о списании

Слушатели событий (устанавливаются в конструкторе):
- `click` на `closeButton` - **эмитит событие `modal:close`**.

Сеттеры:
- `set amount(amount: number): void` - устанавливает сумму списания в элемент `debitEl`.

### Класс BasketView

Класс для отображения содержимого корзины.
Является дочерним классом `Component<BasketViewData>`.

Конструктор:
`constructor(container: HTMLElement, events: IEvents)` - принимает ссылку на DOM-элемент контейнера корзины и брокер событий.

Поля класса:
- `completeButton: HTMLButtonElement` - кнопка оформления заказа
- `shoppingListEl: HTMLElement` - контейнер списка товаров в корзине
- `totalCostEl: HTMLElement` - элемент отображения общей стоимости корзины

Слушатели событий (устанавливаются в конструкторе):
- `click` на `completeButton` - **эмитит событие `order:edit`**.

Сеттеры:
- `set valid(value: boolean): void` - управляет состоянием кнопки «Оформить» (активна/деактивирована).
- `set purchases(items: HTMLElement[]): void` - принимает массив DOM-элементов товаров и добавляет их в `shoppingListEl`.
- `set totalCost(value: number): void` - устанавливает общую стоимость корзины в элемент `totalCostEl`.

### Абстрактный класс CardView

Абстрактный базовый класс для компонентов карточек. Наследуется от `Component<T>`, где `T` — базовый тип данных.

Конструктор:
`constructor(container: HTMLElement, events?: IEvents)` - принимает ссылку на DOM-элемент-обёртку карточки и опционально брокер событий.

Поля класса:
- `abstract cardButton: HTMLButtonElement` - кнопка, связанная с карточкой
- `titleEl: HTMLElement` - элемент DOM для отображения названия товара
- `priceEl: HTMLElement` - элемент DOM для отображения цены товара

Сеттеры:
- `set title(title: string): void` - устанавливает название товара в `titleEl`
- `set price(price: number | null): void` - устанавливает цену товара в `priceEl`
- `set id(value: string): void` - устанавливает `dataset.id` на корневом элементе контейнера

### Класс CardCatalogView

Реализует компонент карточки товара для каталога.
Наследуется от `CardView<CardCatalogData>`.

Конструктор:
`constructor(container: HTMLElement, events?: IEvents)` - принимает ссылку на DOM-элемент карточки в каталоге и опционально брокер событий.

Поля класса:
- `cardButton: HTMLButtonElement` - кнопка карточки (сам контейнер)
- `titleEl: HTMLElement` - элемент DOM для отображения названия товара
- `priceEl: HTMLElement` - элемент DOM для отображения цены товара
- `categoryEl: HTMLElement` - элемент DOM для отображения категории товара (например, «софт-скил»)
- `cardImage: HTMLImageElement` - элемент `<img>` для отображения изображения товара

Слушатели событий (устанавливаются в конструкторе):
- `click` на `cardButton` - **эмитит событие `card:select`** с `{ id: string }` из `dataset.id` контейнера.

Сеттеры:
- `set title(title: string): void` - устанавливает название товара в `titleEl`
- `set price(price: number | null): void` - устанавливает цену товара в `priceEl`
- `set category(name: string): void` - устанавливает текст категории в `categoryEl`
- `set image(src: string): void` - устанавливает атрибут `src` у элемента `cardImage`

### Класс CardPreview

Реализует компонент карточки товара для модального окна предпросмотра.
Наследуется от `CardCatalogView<CardPreviewData>`.

Конструктор:
`constructor(container: HTMLElement, events?: IEvents)` - принимает ссылку на DOM-элемент карточки в модальном окне и опционально брокер событий.

Поля класса:
- `cardButton: HTMLButtonElement` - кнопка добавления товара в корзину
- `descriptionEl: HTMLElement` - элемент DOM для отображения описания товара (например, `<p class="card__text">`)
- (унаследованы `titleEl`, `priceEl`, `categoryEl`, `cardImage`)

Слушатели событий (устанавливаются в конструкторе):
- `click` на `cardButton` - **эмитит событие `card:order`**.

Сеттеры:
- `set description(text: string): void` - устанавливает текст описания в `descriptionEl`

### Класс CardBasketView

Реализует компонент карточки товара в корзине.
Наследуется от `CardView<CardBasketData>`.

Конструктор:
`constructor(container: HTMLElement, events?: IEvents)` - принимает ссылку на DOM-элемент карточки в корзине и опционально брокер событий.

Поля класса:
- `cardButton: HTMLButtonElement` - кнопка удаления товара из корзины
- `indexEl: HTMLElement` - элемент DOM для отображения порядкового номера товара в корзине
- (унаследованы `titleEl`, `priceEl`)

Слушатели событий (устанавливаются в конструкторе):
- `click` на `cardButton` - **эмитит событие `basket:delete`** с `{ id: string }` из `dataset.id` контейнера.

Сеттеры:
- `set index(value: number): void` - устанавливает порядковый номер в `indexEl`

### Абстрактный класс FormView

Абстрактный базовый класс для всех компонентов форм.
Является дженериком и принимает в параметре `T` тип данных для формы.

Конструктор:
`constructor(container: HTMLFormElement, events: IEvents)` - принимает ссылку на DOM-элемент формы и брокер событий.

Поля класса:
- `submitButton: HTMLButtonElement` - кнопка отправки формы
- `errorsEl: HTMLElement` - элемент для отображения ошибок валидации

Слушатели событий (устанавливаются в конструкторе):
- `input` на `container` - **эмитит событие `form:change`** с `{ name: string, value: string }`.
- `submit` на `container` - **эмитит событие `form:submit`**.

Сеттеры:
- `set valid(value: boolean): void` - управляет состоянием кнопки отправки формы (активна/деактивирована).
- `set error(value: CustomerErrors): void` - отображает объект ошибок в `errorsEl`.

### Класс OrderFormView

Класс для отображения и управления формой оформления заказа (выбор способа оплаты и адреса доставки).
Наследуется от `FormView<OrderFormData>`.

Конструктор:
`constructor(container: HTMLFormElement, events: IEvents)` - принимает ссылку на DOM-элемент формы и брокер событий.

Поля класса:
- `paymentButtons: HTMLButtonElement[]` - массив кнопок выбора способа оплаты
- `addressInputEl: HTMLInputElement` - поле ввода адреса доставки

Слушатели событий (устанавливаются в конструкторе):
- `click` на каждую кнопку из `paymentButtons` - **эмитит событие `form:change`** с `{ name: 'payment', value: btn.value }`.

Сеттеры:
- `set payment(value: Payment | null): void` - устанавливает активный класс `button_alt-active` на выбранной кнопке оплаты
- `set address(value: string): void` - устанавливает значение адреса доставки

### Класс ContactsFormView

Класс для отображения и управления формой ввода контактных данных (Email и телефон).
Наследуется от `FormView<ContactsFormData>`.

Конструктор:
`constructor(container: HTMLFormElement, events: IEvents)` - принимает ссылку на DOM-элемент формы и брокер событий.

Поля класса:
- `emailInputEl: HTMLInputElement` - поле ввода email
- `phoneInputEl: HTMLInputElement` - поле ввода телефона

Слушатели событий: отсутствуют (все изменения полей обрабатываются базовым классом `FormView` через событие `input`).

Сеттеры:
- `set email(value: string): void` - устанавливает значение email
- `set phone(value: string): void` - устанавливает значение телефона

## События приложения

Взаимодействие между слоями модели и представления осуществляется через брокер событий (`EventEmitter`). Ниже приведён полный список событий, используемых в приложении.

### События моделей данных

| Событие | Источник | Когда эмитится | Передаваемые данные |
|---|---|---|---|
| `items:changed` | `CatalogModel` | При загрузке или обновлении списка товаров каталога | `{ products: Product[] }` |
| `preview:changed` | `CatalogModel` | При выборе товара для просмотра (установка `selectedProduct`) | `{ product: Product }` |
| `basket:changed` | `CartModel` | При добавлении, удалении одного товара или очистке корзины | `{ product?: Product, products: Product[] }` |
| `order:changed` | `CustomerModel` | При изменении любого поля заказа (`payment`, `address`, `email`, `phone`) или при очистке данных | `CustomerErrors` — объект с текстами ошибок валидации |

### События представлений

| Событие | Источник | Когда эмитится | Передаваемые данные |
|---|---|---|---|
| `card:select` | `CardCatalogView` | Клик по карточке товара в каталоге | `{ id: string }` — id товара из `dataset.id` |
| `card:order` | `CardPreview` | Нажатие кнопки «Купить» / «Удалить из корзины» в превью товара | — |
| `basket:delete` | `CardBasketView` | Нажатие кнопки удаления товара из корзины | `{ id: string }` — id товара из `dataset.id` |
| `basket:open` | `HeaderView` | Клик по иконке корзины в шапке | — |
| `order:edit` | `BasketView` | Нажатие кнопки «Оформить» в корзине | — |
| `modal:close` | `ModalView` | Клик по кнопке закрытия или по фону модального окна | — |
| `success:close` | `SuccessView` | Клик по кнопке Продолжить покупки | — |
| `form:change` | `FormView`, `OrderFormView` | Любое изменение поля в форме (input) или клик по кнопке оплаты | `{ name: string, value: string }` |
| `form:submit` | `FormView` | Нажатие кнопки отправки формы (submit) | — |

### Сводная таблица: кто эмитит, кто слушает

| Событие | Эмитент | Слушатель | Действие слушателя |
|---|---|---|---|
| `items:changed` | `CatalogModel` | `main.ts` | Рендер списка карточек товаров на странице |
| `preview:changed` | `CatalogModel` | `main.ts` | Открытие модального окна с превью выбранного товара |
| `basket:changed` | `CartModel` | `main.ts` | Обновление счётчика товаров в шапке и содержимого корзины |
| `order:changed` | `CustomerModel` | `main.ts` | Обновление состояния валидности и текста ошибок в формах оформления |
| `card:select` | `CardCatalogView` | `main.ts` | Установка `selectedProduct` в `CatalogModel` |
| `card:order` | `CardPreview` | `main.ts` | Добавление/удаление товара из корзины и закрытие модалки |
| `basket:delete` | `CardBasketView` | `main.ts` | Удаление товара из корзины |
| `basket:open` | `HeaderView` | `main.ts` | Открытие модального окна с корзиной |
| `order:edit` | `BasketView` | `main.ts` | Открытие модального окна с первой формой оформления заказа |
| `modal:close` | `ModalView`, `SuccessView` | `main.ts` | Закрытие модального окна (установка `hidden = true`) |
| `form:change` | `FormView`, `OrderFormView` | `main.ts` | Обновление соответствующего поля в `CustomerModel` и перерендер формы |
| `form:submit` | `FormView` | `main.ts` | Валидация формы, переход между формами или отправка заказа на сервер |