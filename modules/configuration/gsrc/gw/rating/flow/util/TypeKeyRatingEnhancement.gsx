package gw.rating.flow.util

uses java.util.Collection

enhancement TypeKeyRatingEnhancement: gw.entity.TypeKey {
  function isOneOf<K extends gw.entity.TypeKey>(c : Collection<K>) : boolean {
    return (K == typeof this) ? c.contains(this) : false
  }

  function isNotOneOf<K extends gw.entity.TypeKey>(c : Collection<K>) : boolean {
    return not isOneOf(c)
  }

  function isOneOf<K extends gw.entity.TypeKey>(value : K) : boolean {
    return (K == typeof this) ? this == value : false
  }

  function isNotOneOf<K extends gw.entity.TypeKey>(value : K) : boolean {
    return not isOneOf(value)
  }
}
