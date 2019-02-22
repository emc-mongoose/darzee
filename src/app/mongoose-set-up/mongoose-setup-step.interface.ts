export interface MongooseSetupStep { 
    id: number; 
    title: string;
    contentLink; 
    isCompleted: boolean;
    isContentDisplaying: boolean;
    
    getId(): number; 
}

