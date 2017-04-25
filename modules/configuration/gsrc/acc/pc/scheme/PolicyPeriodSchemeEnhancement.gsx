package acc.pc.scheme

enhancement PolicyPeriodSchemeEnhancement: PolicyPeriod {

  public property get Scheme() : Scheme_Ext {
    return getScheme(10)
  }

  public property set Scheme(inScheme : Scheme_Ext) {
    this.addScheme(inScheme, 10)
  }

  public property get SecondaryScheme() : Scheme_Ext {
    return getScheme(20)
  }

  public property set SecondaryScheme(inScheme : Scheme_Ext) {
    this.addScheme(inScheme, 20)
  }

  public function addScheme(inScheme : Scheme_Ext, inOrder : int) {
    if(inScheme == null){
      var link = this.EffectiveDatedFields.SchemeLinks.firstWhere(\elt -> elt.SchemeOrder == inOrder)
      if(link != null){
        link.remove()
      }
    } else {
      if (this.EffectiveDatedFields.SchemeLinks.hasMatch(\elt1 -> elt1.SchemeOrder == inOrder)) {
        this.EffectiveDatedFields.SchemeLinks.firstWhere(\elt -> elt.SchemeOrder == inOrder).Scheme = inScheme
      } else {
        this.EffectiveDatedFields.addToSchemeLinks(new SchemeLink_Ext(this){:SchemeOrder = inOrder, :Scheme = inScheme})
      }
    }
  }

  public function getScheme(inOrder : int) : Scheme_Ext {
    if(this.EffectiveDatedFields.SchemeLinks.hasMatch(\elt1 -> elt1.SchemeOrder == inOrder)) {
      return this.EffectiveDatedFields.SchemeLinks.firstWhere(\elt -> elt.SchemeOrder == inOrder).Scheme
    } else {
      return null
    }
  }

}
