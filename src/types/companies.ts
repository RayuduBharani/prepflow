interface CompaniesSearchParams {
    companies : string[];
    difficulty : Difficulty;
    status : 'todo' | 'solved';
    topics : string[];
    sort : string;
}