export interface IMission {
    missionId: number;
  missionTitle?: string;
  missionShortDescription?: string;
  missionDescription: string;
  cityId: number;
  ThemeId: number;
  missionType: number;
  missionOrganisationName: string;
  missionStartDate: Date;
  missionEndDate: Date;
  totalSeats: number;
  occupiedSeats?: number;
  achievedGoal?: number;
  totalGoal: number;
  missionRating?: number;
  missionRegistrationDeadline: Date;
  goalObject: string;
  image: Uint8Array;
  favourite : number;
  isApplied : boolean;
}
