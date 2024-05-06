export type JWTPort<T = any> = {
  sign(data: T): Promise<string>;
  verify(token: string): Promise<T>;
  // TODO: implement signOut
  // signOut(token: string): Promise<void>;
}

/*
Para implementar o logout no seu código, você pode seguir os seguintes passos:

Criar uma lista de tokens inválidos: Adicione uma estrutura de dados (como um array, um banco de dados ou um serviço externo) para armazenar os tokens inválidos ou revogados.

Criar um endpoint de logout: Adicione um endpoint na sua API que receba o token a ser invalidado e o adicione à lista de tokens inválidos.

Validar o token durante a autenticação: Antes de conceder acesso a um usuário com um token, verifique se o token não está na lista de tokens inválidos.

Limpar tokens inválidos: Implemente um mecanismo para limpar regularmente os tokens inválidos da lista para não sobrecarregar o armazenamento.

Aqui está um exemplo simplificado de como você poderia implementar o logout no seu código:
// Adicione um método na classe JWTAdapter para invalidar um token
export class JWTAdapter implements JWTPort<JWTData> {
  invalidTokens: Set<string> = new Set();

  async logout(token: string): Promise<void> {
    this.invalidTokens.add(token);
  }

  async sign(data: JWTData): Promise<string> {
    // Se o token estiver na lista de tokens inválidos, lance um erro
    if (this.invalidTokens.has(data.token)) {
      throw new Error('Token inválido');
    }

    // Implemente a lógica de geração do token
  }
}

// No seu endpoint de logout, chame o método para invalidar o token
app.post('/logout', async (req, res) => {
  const { token } = req.body;
  await jwtAdapter.logout(token);
  res.send('Token invalidado com sucesso');
});


Para implementar um mecanismo para limpar regularmente os tokens inválidos, você pode seguir as seguintes etapas:

Agendar uma tarefa de limpeza: Utilize uma biblioteca de agendamento de tarefas (como node-cron para Node.js) para agendar uma tarefa que será executada periodicamente para limpar os tokens inválidos.

Definir a lógica de limpeza: Na tarefa agendada, percorra a lista de tokens inválidos e remova aqueles que já expiraram ou não são mais necessários.

Executar a tarefa de limpeza: Certifique-se de que a tarefa de limpeza seja executada regularmente, com uma frequência adequada para o seu caso de uso.

Aqui está um exemplo simplificado de como você poderia implementar um mecanismo de limpeza de tokens inválidos:

// Agende uma tarefa para limpar os tokens inválidos a cada 24 horas
const cron = require('node-cron');
*/
// cron.schedule('0 0 */24 * * *', () => {
//   cleanInvalidTokens();
// });

// function cleanInvalidTokens() {
//   const now = Date.now();
//   invalidTokens.forEach((token, expirationTime) => {
//     if (expirationTime < now) {
//       invalidTokens.delete(token);
//     }
//   });
// }
