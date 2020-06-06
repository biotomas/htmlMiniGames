<?php
    $version = 0.3;

    // you can use this to quickly test multiple environment vars
    // putenv("AOH_BASE_URL=http://localhost:80/aoh");
    // putenv("AOH_FPS=60");
    // putenv("AOH_DB_SERVER=localhost:3306");
    // putenv("AOH_DB_SCHEMA=aoh");
    // putenv("AOH_DB_USER=aoh");
    // putenv("AOH_DB_PASS=aoh");

    function readEnv($key) {
        $result = getenv($key);
        if (!$result) throw new Exception("env $key must be defined");
        return $result;
    }

    function ENV_BASE_URL() {
        return readEnv('AOH_BASE_URL');
    }
  
    function ENV_FPS() {
        return readEnv('AOH_FPS');
    }

    function ENV_DB() {
        // error_log(print_r(getenv(), 1));
        $result['server'] = readEnv("AOH_DB_SERVER"); 
        $result['schema'] = readEnv("AOH_DB_SCHEMA"); 
        $result['user'] = readEnv("AOH_DB_USER"); 
        $result['password'] = readEnv("AOH_DB_PASS"); 
        return $result;
    }
?>
