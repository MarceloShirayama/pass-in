export class EmailValidator {
  static isValid(email: unknown): boolean {
    const localPartRegex = /^[a-zA-Z0-9._-]{1,64}$/;
    const domainFirstPartRegex = /^[a-zA-Z0-9.-]{1,255}$/;
    const domainSecondPartRegex = /^[a-zA-Z]{2,}$/;

    if (typeof email !== 'string') return false

    const [local, domain] = email.split("@");
    if (!local || !domain) return false

    const [domainFirstPart, domainSecondPart] = domain.split(".");
    if (!domainFirstPart || !domainSecondPart) return false

    const localPartIsValid = localPartRegex.test(local)
    const domainFirstPartIsValid = domainFirstPartRegex.test(domainFirstPart)
    const domainSecondPartIsValid = domainSecondPartRegex.test(domainSecondPart)

    return (
      localPartIsValid &&
      domainFirstPartIsValid &&
      domainSecondPartIsValid
    )
  }
}