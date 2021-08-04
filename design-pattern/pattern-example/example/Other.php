<?php

class BaseController
{

  public function __construct()
  {
    
  }

}

class ExamController extends BaseController
{

  /** 
   * {
   * title: "",
   * description: "",
   * setting: {
   *    devices: [],
   *    token: null,
   * }
   * }
   */

  public function __construct(ExamRepo $examRepo)
  {
    parent::__construct();
    $this->examRepo = $examRepo;
  }

  public function create(Request $request)
  {
    try {
      $examEntity = $this->examRepo->create(new CreateExamEntityFactory($request));
      $examViewModel = new ExamViewModel($examEntity);
      return response()->json($examViewModel, 200);    
    } catch(\Exception $e) {
      return ExceptionHandlerFactory::make($e)->handle();
    }
  }

}

class CreateExamRequest
{

  public function rules(): array
  {
    return CreateExamEntity::RULES;
  }

}

class CreateExamEntity
{

  const RULES = [
    "title" => [
      "required",
      "min:3",
      "max:100"
    ],
  ];

  private $title;//panjang min: 3, maks 100
  private $description;
  private $setting;

  public function __construct(array $data)
  {
    if (!$this->isValid($data)) {
      throw new ValidationException('Invalid data supplied');
    }
    if (array_key_exists("title", $data)) {
      $this->title = $data["title"];
    }

    if ($this->data->token !== null) {
      $this->setting = new SettingEntity([
        'token' => $this->data->token,
      ]);
    }
  }

  /** 
   * SETTER
   */

}

class UpdateExamEntity
{

  public function __construct(array $data)
  {
    if (!$this->isValid($data)) {
      throw new Exception('Invalid data supplied');
    }
    $this->data = $data;
  }

}

class CreateExamEntityFactory
{

  public function __construct(array $data)
  {
    //validasi
    //set data
  }

  public function make(): CreateExamEntity
  {
    $examEntity = new CreateExamEntity();
    $examEntity->setTitle($this->data->title)
      ->setDescription($this->data->description)
      ->setStartAt(date("Y-m-d H:i:s", strtotime($this->data->start_date . $this->data->start_time)));
    return $examEntity;
  }

}

class ExamRepo
{

  public function create(CreateExamEntity $examData): Exam
  {
    try {
      DB::beginTransaction();
      $exam = Exam::create([
        'title' => $examData->getTitle(),
        'description' => $examData->hasDescription() ? $examData->getDescription() : 
          $exam->getDefaultDescription(),
      ]);
      $exam->setting()->create([
        'token' => $examData->setting->getToken(),
      ]);
      DB::commit();
      return $exam;
    } catch(\Exception $e) {
      if ($e instanceof LaravelFailedException) {
        throw new FailedDatabaseInsertException();
      }
      throw new Exception();
    }    
  }

}

class ValidationException extends Exception
{

  private $errors;

  public function getErrors(): array
  {
    return $this->errors;
  }

}

class FailedDatabaseInsertException extends Exception
{


}


interface ExceptionInterface
{
  public function handle();
}

abstract class ExceptionHandler implements ExceptionInterface
{

  public function handle()
  {
    //defalt behaviour
    return response()->json([

    ], 400);
  }

}

class ValidationExceptionHandler extends ExceptionHandler
{

  public function handle()
  {
    return response()->json([
      "errors" => $this->exception->getErrors()
    ], 422);
  }

}

class ExceptionHandlerFactory
{

  public static function make(Exception $exception): ExceptionHandler
  {
    if ($exception instanceof ValidationException) {
      return new ValidationExceptionHandler($exception);
    }
  }

}
