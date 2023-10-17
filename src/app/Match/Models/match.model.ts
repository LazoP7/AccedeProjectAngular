import { CustomLocation } from "./location.model";
import { Player } from "./player.model";

export interface matchModel {
    date : Date,
    num_of_players: number,
    locationName : CustomLocation,
    players: Array<Player>;


}