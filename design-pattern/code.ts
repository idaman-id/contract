

/**********************************/
/**
 * EXPRESS
 */ 
 interface Handler { }

 class ExpressApplication 
 {
   
   use(handler: Handler)
   {
 
   }
 
   get(path: string, handlers: Array<Handler>)
   {
 
   }
 
 }
 
 function express(): ExpressApplication
 {
   return new ExpressApplication();
 }
 /**********************************/
 
 
 /**********************************/
 /**
  * BATARA
  */
 enum HttpMethod {
   GET = "get"
 };
 
 interface IRoute
 {
   path: string,
   method: HttpMethod,
   handler: Function,
   middlewares?: Array<string>,
 }
 
 interface IMiddlewareProvider
 {
   name: string,
   handler: (new () => Middleware) //https://stackoverflow.com/questions/44988702/cannot-use-new-with-the-function-type-in-typescript
 }
 
 interface Request {}
 interface Response {}
 interface NextFunction {}
 
 interface IMiddleware
 {
   handle(...args: any): any
 }
 
 interface Provider
 {
   register(...args: any): void;
 }
 
 class Application
 {
 
   private instance: ExpressApplication;
 
   constructor()
   {
     this.instance = express();
   }
 
   public use(handler: Handler)
   {
     this.instance.use(handler);
   }
 
   public get(path: string, handlers: Array<Handler>)
   {
     this.instance.get(path, handlers);
   }
 
 
 }
 
 abstract class Controller
 {
 
 }
 
 abstract class Middleware implements IMiddleware
 {
 
   abstract handle(req: Request, res: Response, next: NextFunction): any
 
 }
 
 interface MiddlewareItem
 {
   name: string,
   middleware: Middleware
 }
 
 let storage: MiddlewareStorage = undefined;
 
 class MiddlewareStorage
 {
 
   private middlewares: Array<MiddlewareItem> = [];
 
   private constructor(middlewares?: Array<MiddlewareItem>)
   {
     this.middlewares = middlewares;
     storage = this;
   }
 
   static getInstance(): MiddlewareStorage
   {
     if (storage !== undefined) {
       return new MiddlewareStorage();
     }
     return storage;
   }
 
   public registerMiddleware(name: string, middleware: Middleware): void
   {
     this.middlewares.push({ name: name, middleware: middleware });
   }
 
   public getMiddlewareNames(): Array<string>
   {
     return this.middlewares.map(middleware => {
       return middleware.name;
     });
   }
 
   public isMiddlewareRegistered(name: string): boolean
   {
     const isRegistered = this.middlewares.find((middleware) => {
       return middleware.name === name;
     });
     return (isRegistered !== null);
   }
 
   public findMiddlewareByName(name: string): Middleware
   {
     const middlewareItem = this.middlewares.find((middleware) => {
       return middleware.name === name;
     });
     if (!middlewareItem) {
       return null;
     }
     return middlewareItem.middleware;
   }
 
 }
 
 
 abstract class BaseProvider implements Provider
 {
 
   protected app: Application;
 
   constructor(app: Application)
   {
     this.app = app;
   }
 
   abstract register(...args: any): void
 
 }
 
 interface Builder<Result>
 {
   getResult(): Result
 }
 
 type RouteItem = Function;
 
 class RouteBuilder implements Builder<Array<RouteItem>>
 {
 
   private routes: Array<RouteItem>;
   private storage: MiddlewareStorage;
 
   constructor()
   {
     this.storage = MiddlewareStorage.getInstance();
   }
 
   public addHandler(handler: Function): void 
   {
     this.routes.push(handler);
   }
 
   public addMiddleware(name: string): void
   {
     if (!this.storage.isMiddlewareRegistered(name)) {
       throw new Error(`Middleware ${name} is not available`);
     }
     const middleware = this.storage.findMiddlewareByName(name);
     this.routes.push(middleware.handle);
   }
 
   public addMiddlewares(names: Array<string>): void
   {
     names.forEach(name => {
       this.addMiddleware(name);
     });
   }
 
   public getResult(): Array<RouteItem>
   {
     return this.routes;
   }
 
 }
 
 /**********************************/
 
 
 /**********************************/
 /**
  * CLIENT
  */
 class ValidationMiddleware extends Middleware
 {
   handle(req: Request, res: Response, next: NextFunction): any
   {
 
   }
 }
 
 class ArticleController extends Controller
 {
   static list(req: Request, res: Response, next: NextFunction)
   {
 
   }
 
   static detail(req: Request, res: Response, next: NextFunction)
   {
 
   }
 }
 
 class V1Route
 {
 
   static routes(): Array<IRoute>
   {
     return [
       {
         path: "/v1/article",
         method: HttpMethod.GET,
         handler: ArticleController.list,
         middlewares: ["validation", "authentication", "logger"],
       },
       {
         path: "/v1/article/:articleId",
         method: HttpMethod.GET,
         handler: ArticleController.detail
       },
     ];
   }
 
 }
 
 class MiddlewareProvider extends BaseProvider
 {
 
   private storage: MiddlewareStorage;
 
   constructor(app)
   {
     super(app);
     this.storage = MiddlewareStorage.getInstance();
   }
 
   register()
   {
     this.middlewares().forEach(middleware => {
       this.storage.registerMiddleware(middleware.name, new middleware.handler());
     });
   }
 
   middlewares(): Array<IMiddlewareProvider>
   {
     return [
       {
         name: "validation",
         handler: ValidationMiddleware
       }
     ];
   }
 
 }
 
 class RouteProvider extends BaseProvider
 {
 
   constructor(app)
   {
     super(app);
   }
 
   register()
   {
     this.routes().forEach(route => {
       const builder = new RouteBuilder();
       builder.addHandler(route.handler);
 
       if (route.hasOwnProperty("middlewares")) {
         builder.addMiddlewares(route.middlewares);
       }
 
       const routes = builder.getResult();
       this.app[route.method](route.path, routes);
     });
   }
 
   routes(): Array<IRoute>
   {
     return [
       ...V1Route.routes()
     ];
   }
 
 }
 /**********************************/
 