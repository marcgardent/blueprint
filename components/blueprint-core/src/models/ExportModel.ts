

export interface IFactoryModel {

    [key: string]: string;
}
export class BindingModel {
    constructor(
        public readonly  factory :string, 
        public readonly  module : string, 
        public readonly  reference : string
    ){
        
    }
}
export class ExportModel {

    constructor(
        public readonly  extension :string, 
        public readonly  blueprint_file : string, 
        public readonly  import_statement : string,
        public readonly factories : IFactoryModel
    ){
        
    }

}