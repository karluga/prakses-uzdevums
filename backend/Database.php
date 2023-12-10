<?php
class Database extends PDO
{
    public function __construct()
    {
        try {
            $conf = parse_ini_file("config.ini", true);

            $dsn = 'mysql:host=' . $conf['DB']['host'] . ';dbname=' . $conf['DB']['name'];
            $username = $conf['DB']['user'];
            $password = $conf['DB']['pass'];

            parent::__construct($dsn, $username, $password, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
            $this->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

        } catch (PDOException $e) {
            echo 'Connection failed: ' . $e->getMessage();
        }
    }
}
?>