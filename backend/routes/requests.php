<?php
// backend/routes/requests.php

// Routeur pour /requests
require_once __DIR__ . '/../controllers/RequestsController.php';

$router->get('/requests', 'RequestsController@index');
$router->post('/requests', 'RequestsController@store');
$router->get('/requests/{id}', 'RequestsController@show');
$router->put('/requests/{id}', 'RequestsController@update');
