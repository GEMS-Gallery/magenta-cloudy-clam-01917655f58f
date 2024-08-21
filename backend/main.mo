import Bool "mo:base/Bool";
import Hash "mo:base/Hash";

import Blob "mo:base/Blob";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Iter "mo:base/Iter";

actor {
  type ImageId = Nat;
  type Image = {
    id: ImageId;
    data: Blob;
  };

  stable var nextImageId : Nat = 0;
  let imageStore = HashMap.HashMap<ImageId, Image>(0, Nat.equal, Nat.hash);

  public func uploadImage(imageData: Blob) : async ImageId {
    let imageId = nextImageId;
    nextImageId += 1;

    let newImage : Image = {
      id = imageId;
      data = imageData;
    };

    imageStore.put(imageId, newImage);
    imageId
  };

  public query func getImage(id: ImageId) : async ?Image {
    imageStore.get(id)
  };

  public query func getAllImages() : async [(ImageId, Image)] {
    Iter.toArray(imageStore.entries())
  };

  public func deleteImage(id: ImageId) : async Bool {
    switch (imageStore.remove(id)) {
      case null { false };
      case (?_) { true };
    }
  };

  // System functions for upgrades
  system func preupgrade() {
    // Implement if necessary
  };

  system func postupgrade() {
    // Implement if necessary
  };
}
