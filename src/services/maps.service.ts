import { PlaceStatus } from "@/models/types/PlaceStatus";
import { StatusCode } from "@/models/types/status.code";
import {
  Client,
  Language,
  PlaceAutocompleteRequest,
  PlaceAutocompleteResult,
  PlaceDetailsRequest,
  PlaceDetailsResponseData,
} from "@googlemaps/google-maps-services-js";

export async function placeAutoComplete(
  address: string
): Promise<PlaceStatus<PlaceAutocompleteResult[]>> {
  try {
    const client: Client = new Client();
    const request: PlaceAutocompleteRequest = {
      params: {
        input: address,
        language: "pt_BR",
        components: ["country:br"],
        key: "AIzaSyC90GoRw5i2ku37yIumudCbgSFS3aT9K6c",
      },
    };
    const result = await client.placeAutocomplete(request);

    return {
      status: StatusCode.Success,
      result: result.data.predictions,
    };
  } catch (e) {
    return {
      status: StatusCode.notFound,
      result: [],
    };
  }
}

export async function placeHospitalDetails(
  placeId: string
): Promise<PlaceStatus<PlaceDetailsResponseData>> {
  try {
    const client: Client = new Client();
    const request: PlaceDetailsRequest = {
      params: {
        place_id: placeId,
        language: Language.pt_BR,
        key: "AIzaSyC90GoRw5i2ku37yIumudCbgSFS3aT9K6c",
      },
    };
    const { data } = await client.placeDetails(request);
    console.log("data", data)
    return {
      status: StatusCode.Success,
      result: data,
    };
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
    return {
      status: StatusCode.notFound,
      result: {} as PlaceDetailsResponseData,
    };
  }
}
