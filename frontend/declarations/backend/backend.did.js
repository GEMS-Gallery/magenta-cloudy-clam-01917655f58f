export const idlFactory = ({ IDL }) => {
  const ImageId = IDL.Nat;
  const Image = IDL.Record({ 'id' : ImageId, 'data' : IDL.Vec(IDL.Nat8) });
  return IDL.Service({
    'deleteImage' : IDL.Func([ImageId], [IDL.Bool], []),
    'getAllImages' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(ImageId, Image))],
        ['query'],
      ),
    'getImage' : IDL.Func([ImageId], [IDL.Opt(Image)], ['query']),
    'uploadImage' : IDL.Func([IDL.Vec(IDL.Nat8)], [ImageId], []),
  });
};
export const init = ({ IDL }) => { return []; };
