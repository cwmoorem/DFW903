package gw.lob.im.sign
uses gw.api.copier.AbstractEffDatedCopyable

@Export
class IMSignEffDatedCopier extends AbstractEffDatedCopyable<IMSign> {

  construct(sign : IMSign) {
    super(sign)
  }


  override function copyBasicFieldsFromBean(sign : IMSign) {
    var thisOne = this._bean
    
    thisOne.Description = sign.Description
    thisOne.Interior = sign.Interior
    thisOne.SignType = sign.SignType
  }

}