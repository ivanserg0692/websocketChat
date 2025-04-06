This is a NODE JS WebsocketServer sending and receiving messages from web interface and Redis Connection 


index.html - is a web client of the user one\
index2.html - is another webclient of the user two

To start the NodeJS server use the following command from the docker folder
```bash
docker-compose up -d 
```


Here an examplme on bitrix for sending messages to the global chat via the Redis connection

```php
use Bitrix\Main\Loader;
use Bitrix\Main\Data\CacheEngineRedis;

require($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");

Loader::includeModule('main');

// Use Bitrix's Redis connection
$engine = new CacheEngineRedis();
$connection = $engine->getConnection();

// Create payload
$data = [
    'from' => 'bitrix_user',
    'message' => 'Hello from Bitrix Redis!',
    'room' => 'global',
];

// Publish to a channel that the Node.js WebSocket server listens to
$connection->publish('room:global', json_encode($data));

echo "Message published to Redis.";
```
You'll see something like 

![image_2025-04-06_18-39-23](https://github.com/user-attachments/assets/4a0b11ff-1d5b-41c4-972d-2d84f76e8996)


![image](https://github.com/user-attachments/assets/e96ba2e5-adde-4993-b1bd-7d9885d308dd)
