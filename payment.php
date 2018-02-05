<?php
set_time_limit(20);
error_reporting(5000);

//Pagamento Checkout Transparente PagSeguro

require_once __DIR__ . '/vendor/autoload.php';
//require_once 'vendor/autoload.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$MEU_EMAIL = "ex@ex.com";
$MEU_TOKEN_SANDBOX = "XXXXXXXXXXXXXXXXXX";

putenv('PAGSEGURO_EMAIL='.$MEU_EMAIL);
putenv('PAGSEGURO_TOKEN_SANDBOX='.$MEU_TOKEN_SANDBOX);
putenv('PAGSEGURO_ENV=sandbox');

\PagSeguro\Library::initialize();
\PagSeguro\Library::cmsVersion()->setName("School of Net")->setRelease("1.0.0");
\PagSeguro\Library::moduleVersion()->setName("School of Net")->setRelease("1.0.0");


function paymentWithCreditCard($items, $hash, $total, $token)
{
    try{
        $creditCard = new \PagSeguro\Domains\Requests\DirectPayment\CreditCard();
        $creditCard->setMode('DEFAULT');
        $creditCard->setCurrency('BRL');

        $creditCard->addItems()->withParameters(
            '0001',
            'Notebook prata',
            2,
            10.00
        );    

        $creditCard->setSender()
            ->setName('Fulaninho de tal')
            ->setEmail('c75358869438663671927@sandbox.pagseguro.com.br')
            ->setPhone()->withParameters('11', '11111111');

        $creditCard->setSender()->setDocument()->withParameters('CPF', '156.009.442-76');
        $creditCard->setSender()->setHash($hash);
        
        $creditCard->setSender()->setIp('127.0.0.0');
        
        
        $creditCard->setShipping()
        ->setAddress()->withParameters(
            'Av. Brig. Faria Lima',
            '1384',
            'Jardim Paulistano',
            '01452002',
            'São Paulo',
            'SP',
            'BRA',
            'apto. 114'
        );
    $creditCard->setBilling()
        ->setAddress()->withParameters(
            'Av. Brig. Faria Lima',
            '1384',
            'Jardim Paulistano',
            '01452002',
            'São Paulo',
            'SP',
            'BRA',
            'apto. 114'
        );
        
        
        $creditCard->setToken($token);
        $creditCard->setInstallment()->withParameters(1, $total);
        
        $creditCard->setHolder()->setBirthdate('01/01/1990');
        $creditCard->setHolder()->setName('Fulaninho de tal');
        $creditCard->setHolder()->setPhone()->withParameters('11', '11111111');
        $creditCard->setHolder()->setDocument()->withParameters('CPF', '156.009.442-76');     
        try
        {
            
            $result = $creditCard->register(\PagSeguro\Configuration\Configure::getAccountCredentials());
            echo json_encode([
                'code' => 'teste '.date('01/01/1990') //$result->getCode()
            ]);
        }
        catch (\Exception $e)
        {
            http_response_code(500);
            echo json_encode([
                'error' => $e->getMessage()
            ]);
        }
    } catch (Exception $ex) {
        echo json_encode([
                'error' => $ex->getMessage()
            ]);
    }
    
    
}

/*$POSTFROMIONIC = file_get_contents("php://input");
$request = json_decode($POSTFROMIONIC);
*/

$data = json_decode(file_get_contents('php://input'), true);
$method = $data['method'];
$items = $data['dadosItem'];
$hash = "adfçasdfjeaofiejjaslkfjksdjfosjf";//$data['hash'];
$total = 30.00; //null; //$data['total'];
$token = null; //$data['token'];

//if ($method == 'CREDIT_CARD') 
//if ($method == 'Credit') 
if (true) 
{
    paymentWithCreditCard($items,$hash,$total,$token);
}
else
{
    $array_retorno["excecao"] = "erro";
    echo json_encode($array_retorno);
}

/*{
    $array_retorno["excecao"] = "erro";
    echo json_encode($array_retorno);
}*/

/*{
    $array_retorno["excecao"] = "erro";
    echo json_encode($data);
}*/
    
/*elseif ($method == 'BOLETO') 
{
    paymentWithBankSlip($items,$hash,$total);
}*/
    
?>