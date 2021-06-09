В этой части приложения собраны все дополнительные приложения.
Структура каждого приложения может быть любая, но обязательными 2 правилами.
1) Не импортировать функции или классы из других приложений.
    Если в этом есть строгая необходимость, то желаемую функцию или класс для импорта 
    следует вынести в общую папку для утилит utils_ и импортировать её оттуда.
2) В каждом приложении в корневой папке приложения должен находится файл urls.py
    В нём содержатся все урлы важего приложения. Класс "app" необходимо импортировать 
    из config. Либо свой кастомный роутер разместить в папке routers и импортировать его оттуда
    Не забыть в конце файла urls.py, есл используется кастомный роутер добать его в приложение:
        app.include_router(ваш ссылка на роутер)

This part of the application contains all additional applications.
The structure of each application can be any, but there are 2 mandatory rules.
1) Don't import functions or classes from other applications.
     If there is a strict need for this, then the desired function or class to import
     should be moved to the shared folder for utils_ utilities and imported from there.
2) In each application, the urls.py file must be located in the root folder of the application
     It contains all the URLs for an important application. The "app" class needs to be imported
     from config. Or place your custom router in the routers folder and import it from there
     Do not forget at the end of the urls.py file, if a custom router is used to add it to the application:
         app.include_router (your router func/class)