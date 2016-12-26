%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                       INITIALIZE                                                      %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% -------------------------------------------------------------------------------------------------------
% Inicializa o tabuleiro baseado no número de jogadores introduzido.
% -------------------------------------------------------------------------------------------------------
initializeBoard(N_Players, Board):-
	write('Enter number of players [2-4]:'),
	read(N_input),
	getBoard(N_Players, N_input, Board).

% -------------------------------------------------------------------------------------------------------
% Cria a lista de listas correspondente ao tabuleiro de acordo com o numero de jogadores.
% No caso de o valor introduzido não existir chama 'initializeBoard' para reintroduzir um valor.
% -------------------------------------------------------------------------------------------------------
getBoard(2, 2,[ [ [], [1,m,v], [2,m,v], [1,m,v], [1,m,v], [2,m,v], [1,m,v], [] ],
	[ [2,m,h], [], [], [], [], [], [], [2,m,h] ],
	[ [1,m,h], [], [], [], [], [], [], [1,m,h] ],
	[ [2,m,h], [], [], [], [], [], [], [2,m,h] ],
	[ [2,m,h], [], [], [], [], [], [], [2,m,h] ],
	[ [1,m,h], [], [], [], [], [], [], [1,m,h] ],
	[ [2,m,h], [], [], [], [], [], [], [2,m,h] ],
	[ [], [1,m,v], [2,m,v], [1,m,v], [1,m,v], [2,m,v], [1,m,v], [] ] ]).
getBoard(3, 3,[[[],[1,m,v],[2,m,v],[3,m,v],[1,m,v],[2,m,v],[3,m,v],[]],
	[ [3,m,h], [], [], [], [], [], [], [3,m,h]],
	[ [2,m,h], [], [], [], [], [], [], [2,m,h]],
	[ [1,m,h], [], [], [], [], [], [], [1,m,h]],
	[ [3,m,h], [], [], [], [], [], [], [3,m,h]],
	[ [2,m,h], [], [], [], [], [], [], [2,m,h]],
	[ [1,m,h], [], [], [], [], [], [], [1,m,h]],
	[[],[1,m,v],[2,m,v],[3,m,v],[1,m,v],[2,m,v],[3,m,v],[]]]).
getBoard(4, 4,[[[],[1,m,v],[2,m,v],[3,m,v],[4,m,v],[1,m,v],[2,m,v],[]],
	[ [3,m,h], [], [], [], [], [], [], [3,m,h]],
	[ [4,m,h], [], [], [], [], [], [], [4,m,h]],
	[ [1,m,h], [], [], [], [], [], [], [1,m,h]],
	[ [2,m,h], [], [], [], [], [], [], [2,m,h]],
	[ [3,m,h], [], [], [], [], [], [], [3,m,h]],
	[ [4,m,h], [], [], [], [], [], [], [4,m,h]],
	[[],[1,m,v],[2,m,v],[3,m,v],[4,m,v],[1,m,v],[2,m,v],[]]]).
getBoard(4, test1,[[[],[],[2,'M',v],[],[],[],[],[]],
	[ [3,m,v], [], [], [], [], [], [], []],
	[ [], [], [], [], [], [], [], [4,'M',h]],
	[ [], [], [], [], [], [], [], []],
	[ [], [], [], [], [], [], [], []],
	[ [], [], [], [], [], [], [], []],
	[ [], [], [], [], [], [], [], []],
	[[],[],[2,'M',v],[],[],[],[2,m,v],[]]]).
getBoard(2, test2,[[[],[],[],[],[],[],[],[]],
	[ [], [], [], [], [], [], [], []],
	[ [], [], [], [], [], [], [], []],
	[ [], [], [], [], [], [], [], []],
	[ [1,m,h], [1,m,h], [1,m,h], [1,m,h], [1,m,h], [1,m,h], [1,m,h], [1,m,h]],
	[ [], [], [], [], [], [], [], []],
	[ [], [], [], [], [], [], [], []],
	[[],[],[2,'M',v],[],[],[],[],[]]]).
getBoard(4, test3,[[[],[],[],[],[2,'M',v],[],[],[]],
	[ [], [], [], [], [], [], [], [3,'M',v]],
	[ [], [], [], [], [], [], [], []],
	[ [], [], [], [], [], [], [], []],
	[ [1,'M',h], [], [], [], [4,m,h], [], [], [4,m,h]],
	[ [], [], [], [], [], [], [], []],
	[ [], [], [], [], [], [], [], []],
	[[],[],[],[],[],[],[],[]]]).
getBoard(N_Players, _, Board):-
	write('Invalid number of players.'), nl, !,
	initializeBoard(N_Players, Board).

% -------------------------------------------------------------------------------------------------------
% Inicializa o tipo de cada jogador (humano ou computador) e insere os dados numa lista.
% -------------------------------------------------------------------------------------------------------
initializeAI(N_Players, Players):-
	write('Choose human and computer players.'), nl,
	initializeAI(1, N_Players, [], Players).
initializeAI(Player, N_Players, Players_1, Players):-
	Player > N_Players,
	!,
	Players = Players_1.
initializeAI(Player, N_Players, Players_0, Players):-
	inputIA(Player, Players_0, Players_1),
	Player1 is Player + 1,
	initializeAI(Player1, N_Players, Players_1, Players).

% -------------------------------------------------------------------------------------------------------	
% Predicado auxiliar de 'initializeAI' que verifica se o input é valido e acrescenta valor à lista.
% A lista com os tipos de jogador também contém a ordem pela qual os jogadores promovem o seu primeiro
% minion a master (valores inicializados com 9).
% -------------------------------------------------------------------------------------------------------
inputIA(Player, Players_0, Players_1):-
	write('Player '), write(Player), write('?'), write('[human or pc]'),
	read(IA_input),
	inputIA(Player, Players_0, Players_1, IA_input).
inputIA(_, Players_0, Players_1, human):-
	append(Players_0, [[human,9]], Players_1).
inputIA(_, Players_0, Players_1, pc):-
	append(Players_0, [[computer,9]], Players_1).
inputIA(Player, Players_0, Players_1, _):-
	write('Invalid option [human or pc]. Try again'), nl,
	inputIA(Player, Players_0, Players_1).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                             DISPLAY                                                   %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% -------------------------------------------------------------------------------------------------------
% Chama os predicados de visualização sobre a lista correspondente ao tabuleiro.
% -------------------------------------------------------------------------------------------------------
display_game(Board):- printboard(Board,w).

% -------------------------------------------------------------------------------------------------------
% Imprime o estado do tabuleiro linha a linha recursivamente usando os predicados auxiliares
% printlinetop, printlinemiddle e printlinebottom.
% -------------------------------------------------------------------------------------------------------
printboard([C|R],w):-
	write('   - - - - - - - - - - - - - - - - - - - - - - - -'),
	nl,
	write('  '),
	printlinetop(C,w), 
	nl,
	length([C|R],RW),
	write(RW),
	write(' '),
	printlinemiddle(C,w), 
	nl,
	write('  '),
	printlinebottom(C,w),
	nl,
	printboard(R,b).
printboard([C|R],b):-
	write('   - - - - - - - - - - - - - - - - - - - - - - - -'),
	nl,
	write('  '),
	printlinetop(C,b),
	nl,
	length([C|R],RW),
	write(RW),
	write(' '),
	printlinemiddle(C,b), 
	nl,
	write('  '),
	printlinebottom(C,b),
	nl,
	printboard(R,w).
printboard([], _):-
	write('   - - - - - - - - - - - - - - - - - - - - - - - -'),
	nl,
	write('     A     B     C     D     E     F     G     H'),
	nl,
	nl.

% -------------------------------------------------------------------------------------------------------
% Cada linha do tabuleiro é representada em 3 linhas de texto. Para cada uma destas linhas é utilizado
% um predicado diferente que lê e imprime recursivamente a lista correspondente à linha do tabuleiro.
% Utilizam os predicados auxiliares printsquaretop, printsquaremiddle e printsquarebottom.
% -------------------------------------------------------------------------------------------------------
printlinetop([C|R],w):-
	printsquaretop(C,w),
	printlinetop(R,b).
printlinetop([C|R],b):-
	printsquaretop(C,b),
	printlinetop(R,w).
printlinetop([], _):-
	write('|').

printlinemiddle([C|R],w):-
	printsquaremiddle(C,w),
	printlinemiddle(R,b).
printlinemiddle([C|R],b):-
	printsquaremiddle(C,b),
	printlinemiddle(R,w).
printlinemiddle([], _):-
	write('|').

printlinebottom([C|R],w):-
	printsquarebottom(C,w),
	printlinebottom(R,b).
printlinebottom([C|R],b):-
	printsquarebottom(C,b),
	printlinebottom(R,w).
printlinebottom([], _):-
	write('|').

% -------------------------------------------------------------------------------------------------------
% printsquaretop, printsquaremiddle e printsquarebottom são predicados auxiliares de printlinetop,
% printlinemiddle e printlinebottom respectivamente para visualização do tabuleiro.
% O primeiro parametro de cada um dos predicados corresponde ao elemento da lista correspondente a um 
% quadrado do tabuleiro e convertido para caracteres de representação de acordo com os dados do elemento
% (se é uma casa vazia ou se tiver peça: o tipo de peça, o jogador a quem pertence e a orientação desta).
% O segundo parametro identifica a cor do quadrado do tabuleiro (preto ou branco) que também é
% representada conformemente.
% -------------------------------------------------------------------------------------------------------	
printsquaretop([ _, _, v],w):-
        write('|  ^  ').
printsquaretop([ _, _, v],b):-
        write('|//^//').
printsquaretop( _, w):-
	write('|     ').
printsquaretop( _, b):-
	write('|/////').

printsquaremiddle([ P, M, h], _):-
        write('|< '),
	player(P,M,Letter),
	write(Letter),
	write(' >').
printsquaremiddle([ P, M, v],w):-
        write('|  '),
	player(P,M,Letter),
	write(Letter),
	write('  ').
printsquaremiddle([ P, M, v],b):-
        write('|//'),
	player(P,M,Letter),
	write(Letter),
	write('//').
printsquaremiddle([],w):-
        write('|     ').
printsquaremiddle([],b):-
        write('|/////').

printsquarebottom([ _, _, v],w):-
        write('|  v  ').
printsquarebottom([ _, _, v],b):-
        write('|//v//').
printsquarebottom( _, w):-
	write('|     ').
printsquarebottom( _, b):-
	write('|/////').

% -------------------------------------------------------------------------------------------------------
% Converte o numero de jogador numa letra para representação das peças
% (minuscula para 'minion' e maiuscula para 'master')
% -------------------------------------------------------------------------------------------------------
player(1,m,a).
player(1,'M','A').
player(2,m,b).
player(2,'M','B').
player(3,m,c).
player(3,'M','C').
player(4,m,d).
player(4,'M','D').

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                MOVE                                                   %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% -------------------------------------------------------------------------------------------------------
% Relação entre os valores numericos e letras das colunas do tabuleiro 
% -------------------------------------------------------------------------------------------------------
column(a,1).
%column('A',1).
column(b,2).
%column('B',2).
column(c,3).
%column('C',3).
column(d,4).
%column('D',4).
column(e,5).
%column('E',5).
column(f,6).
%column('F',6).
column(g,7).
%column('G',7).
column(h,8).
%column('H',8).

% -------------------------------------------------------------------------------------------------------
% Valores válidos para o número da linha.
% -------------------------------------------------------------------------------------------------------
row(1).
row(2).
row(3).
row(4).
row(5).
row(6).
row(7).
row(8).

% -------------------------------------------------------------------------------------------------------
% Valores válidos para o número de movimentos.
% -------------------------------------------------------------------------------------------------------
nmoves(1).
nmoves(2).
nmoves(3).
nmoves(4).
nmoves(5).
nmoves(6).
nmoves(7).
nmoves(-1).
nmoves(-2).
nmoves(-3).
nmoves(-4).
nmoves(-5).
nmoves(-6).
nmoves(-7).

% -------------------------------------------------------------------------------------------------------
% Verifica se as coordenadas são de um canto do tabuleiro.
% -------------------------------------------------------------------------------------------------------
corner(1,a).
corner(1,'A').
corner(1,h).
corner(1,'H').
corner(8,a).
corner(8,'A').
corner(8,h).
corner(8,'H').

% -------------------------------------------------------------------------------------------------------
% Actualiza a lista dos jogadores com a ordem do primeiro master de cada jogador.
% Substitui o valor caso ainda seja o valor inicializado (9) pelo valor obtido pelo predicado 'order'.
% -------------------------------------------------------------------------------------------------------
updatePlayers(Player, Players, Players1):-
	nth1(Player, Players, List),
	nth1(2, List, 9),
	order(Players, Order),
	playerType(Player, Players, PlayerType),
	N is Player - 1,
	length(L, N),
	append(L, [ _ | R ], Players),
	append(L, [ [PlayerType, Order] | R ], Players1).
updatePlayers(_, Players, Players).

% -------------------------------------------------------------------------------------------------------
% Verifica o ultimo numero da ordem das promoções existente na lista e devolve o valor seguinte
% (ordem com que os jogadores fazem a sua primeira promoção de minion a master).
% -------------------------------------------------------------------------------------------------------
order(Players, Order):-
	member([ _, 3] , Players),
	Order = 4.
order(Players, Order):-
	member([ _, 2] , Players),
	Order = 3.
order(Players, Order):-
	member([ _, 1] , Players),
	Order = 2.
order(_, 1).

% -------------------------------------------------------------------------------------------------------
% Verifica se a peça deve ser promovida - nunca falha.
% Devolve o tipo de peça no fim de um movimento e actualiza a lista da ordem das promoções. 
% -------------------------------------------------------------------------------------------------------
promote(Board, _, Players, Players1, Row, Column, _, _, Type):-
	piece( _, Board, Row, Column, _, 'M'),
	Type = 'M',
	Players1 = Players.
promote(_, Player, Players, Players1, _, _, Row1, Column1, Type):-
	corner(Row1, Column1),
	Type = 'M',
	updatePlayers(Player, Players, Players1).
promote(_, _, Players, Players, _, _, _, _, m).

% -------------------------------------------------------------------------------------------------------
% Alterna a orientação da peça. 
% -------------------------------------------------------------------------------------------------------
switch_orientation(h,v).
switch_orientation(v,h).

% -------------------------------------------------------------------------------------------------------
% Verifica se a peça está dentro do tabuleiro (coordenadas válidas). 
% -------------------------------------------------------------------------------------------------------
inbounds(Row, Column):-
	row(Row),
	column(Column, _).

% -------------------------------------------------------------------------------------------------------
% Verifica uma peça da lista correspondente do tabuleiro. Pode ser usado para saber:
% - se existe uma peça nas coordenadas dadas;
% - o jogador a qual pertence a peça nas coordenadas dadas ou se a peça pertence a um jogador dado;
% - qual a orientação da peça nas coordenadas dadas e ou qual o seu tipo
% -------------------------------------------------------------------------------------------------------
piece(Player, Board, Row, Column, Orientation, Type):-
	column(Column, Elem),
	Line is 9 - Row,
	nth1(Line, Board, Line_list),
	nth1(Elem, Line_list, [Player, Type, Orientation]).

% -------------------------------------------------------------------------------------------------------
% Verifica o número de movimentos de uma peça é ímpar ou se a peça é master (não sujeita a restrição)
% -------------------------------------------------------------------------------------------------------

odd(_, 'M').
odd(N_moves, _):-
	X is N_moves mod 2,
	X = 1.

% -------------------------------------------------------------------------------------------------------
% Calcula as coordenadas finais de um movimento e se são válidas
% -------------------------------------------------------------------------------------------------------
position(Row, Column, N_moves, v, Row1, Column1):-
	Row1 is Row + N_moves,
	row(Row1),
	Column1 = Column.
position(Row, Column, N_moves, h, Row1, Column1):-
	Row1 is Row,
	column(Column, C),
	C1 is C + N_moves,
	column(Column1, C1).

	
% -------------------------------------------------------------------------------------------------------
% Verifica se não existem peças entre as coordenadas iniciais e finais de uma peça
% -------------------------------------------------------------------------------------------------------
nojump(_, _, _, 1, _).
nojump(_, _, _, -1, _).
nojump(Board, Row, Column, N, h):-
	N > 1,
	column(Column, C),
	C1 is C + 1,
	column(Column1, C1),
	piece(_, Board, Row, Column1, _, _),
	!,
	fail.
nojump(Board, Row, Column, N, h):-
	N > 1,
	N1 is N - 1,
	column(Column, C),
	C1 is C + 1,
	column(Column1, C1),
	nojump(Board, Row, Column1, N1, h).
nojump(Board, Row, Column, N, h):-
	N < -1,
	column(Column, C),
	C1 is C - 1,
	column(Column1, C1),
	piece(_, Board, Row, Column1, _, _),
	!,
	fail.
nojump(Board, Row, Column, N, h):-
	N < -1,
	N1 is N + 1,
	column(Column, C),
	C1 is C - 1,
	column(Column1, C1),
	nojump(Board, Row, Column1, N1, h).
nojump(Board, Row, Column, N, v):-
	N > 1,
	Row1 is Row + 1,
	piece(_, Board, Row1, Column, _, _),
	!,
	fail.
nojump(Board, Row, Column, N, v):-
	N > 1,
	N1 is N - 1,
	Row1 is Row + 1,
	nojump(Board, Row1, Column, N1, v).
nojump(Board, Row, Column, N, v):-
	N < -1,
	Row1 is Row - 1,
	piece(_, Board, Row1, Column, _, _),
	!,
	fail.
nojump(Board, Row, Column, N, v):-
	N < -1,
	N1 is N + 1,
	Row1 is Row - 1,
	nojump(Board, Row1, Column, N1, v).

% -------------------------------------------------------------------------------------------------------
% Verifica se as coordenadas finais de uma peça não correspondem a coordenadas de uma peça do mesmo
% jogador (jogada ilegal).
% -------------------------------------------------------------------------------------------------------	
no_land_over_own_piece(Board, Player, Row, Column):-
	piece(Player, Board, Row, Column, _, _),
	!,
	fail.
no_land_over_own_piece(_, _, _, _).


% -------------------------------------------------------------------------------------------------------
% Verifica todas as restrições de movimentos. No caso de input de utilizador (valid_move/8) não falha
% mas imprime a primeira restrição que não cumpre e requer novos valores.
% -------------------------------------------------------------------------------------------------------
valid_move(Player, Board, Row, Column, N_moves, Row_valid, Column_valid, N_moves_valid):-
	inbounds(Row, Column),
	N_moves \= 0,
	piece(Player, Board, Row, Column, Orientation, Type),
	odd(N_moves, Type),
	position(Row, Column, N_moves, Orientation, Row1, Column1),
	nojump(Board, Row, Column, N_moves, Orientation),
	no_land_over_own_piece(Board, Player, Row1, Column1),
	!,
	Row_valid = Row,
	Column_valid = Column,
	N_moves_valid = N_moves.
valid_move(Player, Board, Row, Column, N_moves, Row_valid, Column_valid, N_moves_valid):-
	inbounds(Row, Column),
	N_moves \= 0,
	piece(Player, Board, Row, Column, Orientation, Type),
	odd(N_moves, Type),
	position(Row, Column, N_moves, Orientation, _, _),
	nojump(Board, Row, Column, N_moves, Orientation),
	write('Cannot move over one of your pieces. Try again.'), nl, nl,
	!,
	choose_move(Player, human, Board, Row_valid, Column_valid, N_moves_valid).
valid_move(Player, Board, Row, Column, N_moves, Row_valid, Column_valid, N_moves_valid):-
	inbounds(Row, Column),
	N_moves \= 0,
	piece(Player, Board, Row, Column, Orientation, Type),
	odd(N_moves, Type),
	position(Row, Column, N_moves, Orientation, _, _),
	write('Cannot jump over other pieces. Try again.'), nl, nl,
	!,
	choose_move(Player, human, Board, Row_valid, Column_valid, N_moves_valid).
valid_move(Player, Board, Row, Column, N_moves, Row_valid, Column_valid, N_moves_valid):-
	inbounds(Row, Column),
	N_moves \= 0,
	piece(Player, Board, Row, Column, _, Type),
	odd(N_moves, Type),
	write('Not a valid number of steps (out of bounds). Try again.'), nl, nl,
	!,
	choose_move(Player, human, Board, Row_valid, Column_valid, N_moves_valid).
valid_move(Player, Board, Row, Column, N_moves, Row_valid, Column_valid, N_moves_valid):-
	inbounds(Row, Column),
	N_moves \= 0,
	piece(Player, Board, Row, Column, _, _),
	write('Not a valid number of steps (piece is minion, must be odd). Try again.'), nl, nl,
	!,
	choose_move(Player, human, Board, Row_valid, Column_valid, N_moves_valid).
valid_move(Player, Board, Row, Column, N_moves, Row_valid, Column_valid, N_moves_valid):-
	inbounds(Row, Column),
	N_moves \= 0,
	write('Not a valid piece. Try again.'), nl, nl,
	!,
	choose_move(Player, human, Board, Row_valid, Column_valid, N_moves_valid).
valid_move(Player, Board, Row, Column, _, Row_valid, Column_valid, N_moves_valid):-
	inbounds(Row, Column),
	write('Number of moves cannot be zero. Try again.'), nl, nl,
	!,
	choose_move(Player, human, Board, Row_valid, Column_valid, N_moves_valid).
valid_move(Player, Board, _, _, _, Row_valid, Column_valid, N_moves_valid):-
	write('Not a valid position in the board. Try again.'), nl, nl,
	!,
	choose_move(Player, human, Board, Row_valid, Column_valid, N_moves_valid).
valid_move(Player, Board, Row, Column, N_moves):-
	column(Column, _),
	row(Row),
	nmoves(N_moves),
	piece(Player, Board, Row, Column, Orientation, Type),
	odd(N_moves, Type),
	position(Row, Column, N_moves, Orientation, Row1, Column1),
	%inbounds(Row1, Column1),
	nojump(Board, Row, Column, N_moves, Orientation),
	no_land_over_own_piece(Board, Player, Row1, Column1).

% -------------------------------------------------------------------------------------------------------
% Verifica se não existem jogadas possíveis.
% -------------------------------------------------------------------------------------------------------
no_valid_moves(Player, Board):-
	valid_move(Player, Board, _, _, _),
	!,
	fail.
no_valid_moves(_, _).

% -------------------------------------------------------------------------------------------------------
% Verifica se entre as jogadas possiveis numa lista existem jogadas para promover minions e guardas numa
% outra lista.
% -------------------------------------------------------------------------------------------------------
corner_moves(_, [], []).
corner_moves(Board, [[Row, Column, N_moves]|T], [[Row, Column, N_moves]|T1]):-
	piece(_, Board, Row, Column, Orientation, m),
	position(Row, Column, N_moves, Orientation, Row1, Column1),
	corner(Row1, Column1),
	!,
	corner_moves(Board, T, T1).
corner_moves(Board, [_|T], T1):- corner_moves(Board, T, T1).

% -------------------------------------------------------------------------------------------------------
% Verifica se entre as jogadas possiveis numa lista existem jogadas para eliminiar peças do adversario
% e guardas numa outra lista.
% -------------------------------------------------------------------------------------------------------
eliminate_moves(_, [], []).
eliminate_moves(Board, [[Row, Column, N_moves]|T], [[Row, Column, N_moves]|T1]):-
	piece(_, Board, Row, Column, Orientation, _),
	position(Row, Column, N_moves, Orientation, Row1, Column1),
	piece(_, Board, Row1, Column1, _, _),
	!,
	eliminate_moves(Board, T, T1).
eliminate_moves(Board, [_|T], T1):- eliminate_moves(Board, T, T1).

% -------------------------------------------------------------------------------------------------------
% No caso de ser 'humano', pede input até conseguir uma jogada válida.
% No caso de o tipo de jogador ser 'computador' procura todas as jogadas validas e dentro dessas as para
% promover minions e as para eliminiar peças do adversario atraves dos respectivos predicados e guarda-as
% em listas diferentes. Utiliza 'choose_priority' para obter uma jogada aleatória dessas listas.
% -------------------------------------------------------------------------------------------------------
choose_move(Player, computer, Board, Row, Column, N_moves):-
	findall([Row, Column, N_moves], valid_move(Player, Board, Row, Column, N_moves), List_moves),
	corner_moves(Board, List_moves, List_corners),
	eliminate_moves(Board, List_moves, List_eliminate),
	choose_priority(List_moves, List_eliminate, List_corners, Row, Column, N_moves),
	sleep(1),
	write('[Computer] Row: '), write(Row), write(', Column: '), write(Column), write(', Number of moves: '), write(N_moves), nl,
	sleep(1).
choose_move(Player, human, Board, Row, Column, N_moves):-
	write('Choose piece´s row [1-8] '), read(Row_input), 
	write('Choose piece´s column [a-h] '), read(Column_input),
	write('Choose number of moves [positive for up/right, negative for down/left] '), read(N_moves_input),
	valid_move(Player, Board, Row_input, Column_input, N_moves_input, Row, Column, N_moves).

% -------------------------------------------------------------------------------------------------------
% Escolhe uma jogada aleatória seguindo as seguintes prioridades:
% - se existir uma jogada para promover um minion escolhe uma jogada aleatória dessa lista;
% - se existir uma jogada para eliminar uma peça do adversário escolhe uma jogada aleatória dessa lista;
% - escolhe uma jogada qualquer aleatoriamente. 
% -------------------------------------------------------------------------------------------------------
choose_priority(List, [], [], Row, Column, N_moves):-
	length(List, Size),
	Max is Size + 1,
	random(1, Max, Rand),
	nth1(Rand, List, [Row, Column, N_moves]).
choose_priority(_, List, [], Row, Column, N_moves):-
	length(List, Size),
	Max is Size + 1,
	random(1, Max, Rand),
	nth1(Rand, List, [Row, Column, N_moves]).
choose_priority(_, _, List, Row, Column, N_moves):-
	length(List, Size),
	Max is Size + 1,
	random(1, Max, Rand),
	nth1(Rand, List, [Row, Column, N_moves]).

% -------------------------------------------------------------------------------------------------------
% Substitui o elemento correspondente a uma peça na lista correspondente ao tabuleiro por um elemento
% vazio ([]). Corresponde a uma peça deslocar-se da sua posição actual.
% -------------------------------------------------------------------------------------------------------
erase_initial_pos(Board1, Board2, Row, Column):-
	Line_N is 9 - Row,
	N1 is Line_N - 1,
	length(L1, N1),
	append(L1, [ Line1 | R1 ], Board1),
	column(Column, Elem_N),
	N2 is Elem_N - 1,
	length(L2, N2),
	append(L2, [ _ | R2 ], Line1),
	append(L2, [ [] | R2 ], Line2),
	append(L1, [ Line2 | R1 ], Board2).

% -------------------------------------------------------------------------------------------------------
% Substitui na lista correspondente ao tabuleiro o elemento correspondente à nova posição de uma peça
% pela informação correspondente a esta e devolve o tabuleiro actualizado.
% -------------------------------------------------------------------------------------------------------
land(Board1, Board2, Row, Column, Player, Type, Orientation):-
	switch_orientation(Orientation, Orientation1),
	Line_N is 9 - Row,
	N1 is Line_N - 1,
	length(L1, N1),
	append(L1, [ Line1 | R1 ], Board1),
	column(Column, Elem_N),
	N2 is Elem_N - 1,
	length(L2, N2),
	append(L2, [ _ | R2 ], Line1),
	append(L2, [ [Player, Type, Orientation1] | R2 ], Line2),
	append(L1, [ Line2 | R1 ], Board2).

% -------------------------------------------------------------------------------------------------------
% Move uma peça e actualiza o tabuleiro.
% -------------------------------------------------------------------------------------------------------
move(Player, Players, Players1, Board_start, Board_final, Row, Column, N_moves):-
	erase_initial_pos(Board_start, Board_erased_init, Row, Column),
	piece( _, Board_start, Row, Column, Orientation, _),
	position(Row, Column, N_moves, Orientation, Row1, Column1),
	promote(Board_start, Player, Players, Players1, Row, Column, Row1, Column1, Type),
	land(Board_erased_init, Board_final, Row1, Column1, Player, Type, Orientation).	

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                               PLAY                                                    %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% -------------------------------------------------------------------------------------------------------
% Calcula qual o próximo jogador em função do número de jogadores
% -------------------------------------------------------------------------------------------------------
nextPlayer(Player, N_Players, Player1):-
	Player < N_Players,
	Player1 is Player + 1.
nextPlayer(Player, N_Players, Player1):-
	Player == N_Players,
	Player1 = 1.

% -------------------------------------------------------------------------------------------------------
% Verifica se o jogador já foi eliminado (se já não possui peças no tabuleiro).
% -------------------------------------------------------------------------------------------------------
player_eliminated(Player, Board):-
	member(Line, Board),
	member([Player,_,_], Line),
	!,
	fail.
player_eliminated(_, _).

% -------------------------------------------------------------------------------------------------------
% Verifica se o jogador já não existem peças do tipo minion no tabuleiro (condição de fim de jogo).
% -------------------------------------------------------------------------------------------------------
no_minions(Board, _, _, _):-
	member(Line, Board),
	member(Square, Line),
	member(m, Square),
	!,
	fail.
no_minions(Board, Players, Winner, WinClause):-
	mostMasters(Board, Players, Winner, WinClause).

% -------------------------------------------------------------------------------------------------------
% Verifica qual o jogador com mais peças do tipo master. No caso de empate verifica condição de desempate.
% -------------------------------------------------------------------------------------------------------	
mostMasters(Board, Players, Winner, WinClause):-
	count_masters(1, Board, Players, [], List),
	check_tie(List, Players, Winner, WinClause).

% -------------------------------------------------------------------------------------------------------
% Contabiliza o numero de peças do tipo master para cada jogador e devolve uma lista com estes valores.
% -------------------------------------------------------------------------------------------------------	
count_masters(Player, _, Players, List, List):-
	length(Players,N),
	Player > N.
count_masters(Player, Board, Players, List, List2):-
	count_player_masters(Player, 0, Board, List, List1),
	Player1 is Player + 1,
	count_masters(Player1, Board, Players, List1, List2).

% -------------------------------------------------------------------------------------------------------
% Contabiliza o numero de peças do tipo master de um jogador e acrescenta-o a uma lista.
% -------------------------------------------------------------------------------------------------------	
count_player_masters(_, Sum, [], List, List1):-
	append(List, [Sum], List1).
count_player_masters(Player, Sum, [H|T], List, List1):-
	delete(H, [Player, _, _], Rest),
	delete(Rest, [Player, _, _], Rest1),
	delete(Rest1, [Player, _, _], Rest2),
	delete(Rest2, [Player, _, _], Rest3),
	length(Rest3,N),
	Sum1 is Sum + 8 - N,
	count_player_masters(Player, Sum1, T, List, List1).

% -------------------------------------------------------------------------------------------------------
% Verifica se existe mais que um jogador com o maior número de masters. Se existir verifica o critério de
% desempate (primeiro a promover uma peça). Devolve sempre o vencedor.
% -------------------------------------------------------------------------------------------------------	
check_tie(List, Players, Winner, 'First Master'):-
	max_member(Max, List),
	nth1(P1, List, Max),
	nth1(P2, List, Max),
	P1 \= P2,
	!,
	firstMaster(List, Max, 1, Players, Winner).
check_tie(List, _, Winner, 'Most Minions'):-
	max_member(Max, List),
	nth1(Winner, List, Max).	

% -------------------------------------------------------------------------------------------------------
% Verifica qual dos jogadores com o maior número de masters foi primeiro a promover uma peça.
% Devolve o vencedor.
% -------------------------------------------------------------------------------------------------------
firstMaster(List, Max, Order, Players, Winner):-
	nth1(Winner, Players, [ _, Order]),
	nth1(Winner, List, Max).
firstMaster(List, Max, Order, Players, Winner):-
	Order1 is Order + 1,
	firstMaster(List, Max, Order1, Players, Winner).

% -------------------------------------------------------------------------------------------------------
% Verifica se só existe um jogador com peças no tabuleiro (condição de fim de jogo).
% -------------------------------------------------------------------------------------------------------	
only_one_player(Board, _):-
	member(Line1, Board),
	member([P1,_,_], Line1),
	member(Line2, Board),
	member([P2,_,_], Line2),
	P1 \= P2,
	!,
	fail.
only_one_player(Board, Player):-
	member(Line1, Board),
	member([Player,_,_], Line1).

% -------------------------------------------------------------------------------------------------------
% Verifica as condições de fim de jogo. Caso se verifique devolve o vencedor e a condição.
% -------------------------------------------------------------------------------------------------------	
game_over(Board, Players, Winner, WinClause):- no_minions(Board, Players, Winner, WinClause).
game_over(Board, _, Winner, 'Last player standing'):- only_one_player(Board, Winner).

% -------------------------------------------------------------------------------------------------------
% Verifica o tipo de jogador (humano ou computador).
% -------------------------------------------------------------------------------------------------------
playerType(Player, Players, PlayerType):-
	nth1(Player, Players, List),
	nth1(1, List, PlayerType).

% -------------------------------------------------------------------------------------------------------
% Jogadas - os jogadores fazem jogadas à vez enquanto não se verificar nenhuma condição de fim de jogo.
% No caso de um jogador ter sido eliminado ou não ter nenhuma jogada possivel passa a vez.
% -------------------------------------------------------------------------------------------------------	
play( _, _, Players, Board):-
	game_over(Board, Players, Winner, WinClause),
	!,
	player(Winner, 'M', Letter),
	write('Game Ended'), nl, nl, write('Player '), write(Letter), write(' is the winner ('), write(WinClause), write(')!').
play(Player, N_Players, Players, Board):-
	player_eliminated(Player, Board),
	!,
	player(Player, 'M', Letter),
	write('Player '), write(Letter), write(' has been eliminated.'), nl, nl,
	nextPlayer(Player, N_Players, Player1),
	play(Player1, N_Players, Players, Board).
play(Player, N_Players, Players, Board):-
	no_valid_moves(Player, Board),
	!,
	player(Player, 'M', Letter),
	write('Player '), write(Letter), write(' is skiping is turn because there are no valid moves.'), nl, nl,
	nextPlayer(Player, N_Players, Player1),
	play(Player1, N_Players, Players, Board).
play(Player, N_Players, Players, Board):-
	player(Player, 'M', Letter),
	write('Player '), write(Letter), write(', make your move.'), nl,
	playerType(Player, Players, PlayerType),
	choose_move(Player, PlayerType, Board, Row, Column, N_moves), nl,
	move(Player, Players, Players1, Board, Board1, Row, Column, N_moves),
	display_game(Board1),
	nextPlayer(Player, N_Players, Player1),
	play(Player1, N_Players, Players1, Board1).

% -------------------------------------------------------------------------------------------------------
% Inicia o jogo.
% -------------------------------------------------------------------------------------------------------	
pivit:-
	use_module(library(lists)),
	use_module(library(random)),
	use_module(library(system)),
	nl, nl, nl, nl, nl, write('---------Welcome to Pivit!---------'), nl, nl,
	initializeBoard(N_Players, Board), nl,
	initializeAI(N_Players, Players), nl,
	display_game(Board),
	play(1, N_Players, Players, Board).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                             TESTS                                                     %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

test1:-
	initializeAI(4, Players),
	write(Players).
test2:-
	land([ [[1,'M',v],[],[],[]], [[],[],[],[]], [[2,m,h],[],[],[]], [[],[],[],[]] ], Board2, 4, 4, 3, 'M', v),
	write(Board2).
test3:-
	erase_initial_pos([ [ [], [1,m,v], [2,m,v], [1,m,v], [1,m,v], [2,m,v], [1,m,v], [] ],
	[ [2,m,h], [], [], [], [], [], [], [2,m,h] ],
	[ [1,m,h], [], [], [], [], [], [], [1,m,h] ],
	[ [2,m,h], [], [], [], [], [], [], [2,m,h] ],
	[ [2,m,h], [], [], [], [], [], [], [2,m,h] ],
	[ [1,m,h], [], [], [], [], [], [], [1,m,h] ],
	[ [2,m,h], [], [], [], [], [], [], [2,m,h] ],
	[ [], [1,m,v], [2,m,v], [1,m,v], [1,m,v], [2,m,v], [1,m,v], [] ] ], Board2, 1, b),
	display_game(Board2).
test4:-
	land([ [ [], [1,m,v], [2,m,v], [1,m,v], [1,m,v], [2,m,v], [1,m,v], [] ],
	[ [2,m,h], [], [], [], [], [], [], [2,m,h] ],
	[ [1,m,h], [], [], [], [], [], [], [1,m,h] ],
	[ [2,m,h], [], [], [], [], [], [], [2,m,h] ],
	[ [2,m,h], [], [], [], [], [], [], [2,m,h] ],
	[ [1,m,h], [], [], [], [], [], [], [1,m,h] ],
	[ [2,m,h], [], [], [], [], [], [], [2,m,h] ],
	[ [], [1,m,v], [2,m,v], [1,m,v], [1,m,v], [2,m,v], [1,m,v], [] ] ], Board2, 3, d, 4, m, h),
	display_game(Board2).
test5:-
	write('1, a, 1, v'), nl,
	position(1, a, 1, v, Row1, Column1),
	write('Row: '), write(Row1), write(', Column: '), write(Column1), nl,
	write('3, b, 2, h'), nl,
	position(3, b, 2, h, Row2, Column2),
	write('Row: '), write(Row2), write(', Column: '), write(Column2), nl.
test6:-
	move(1, [ [ [], [], [], [1,m,v], [1,m,v], [2,m,v], [1,m,v], [] ],
	[ [2,m,h], [], [], [], [], [], [], [2,m,h] ],
	[ [1,m,h], [], [], [], [], [], [], [1,m,h] ],
	[ [], [], [], [], [], [], [], [] ],
	[ [2,m,h], [], [], [], [], [], [], [2,m,h] ],
	[ [1,m,h], [], [], [], [], [], [], [] ],
	[ [2,m,h], [], [], [], [], [], [], [] ],
	[ [], [1,m,v], [], [1,m,v], [], [2,m,v], [1,m,h], [] ] ], Board2, 1, g, 1),
	display_game(Board2).
test7:-
	move(1, [ [ [], [], [], [1,m,v], [1,m,v], [2,m,v], [1,m,v], [] ],
	[ [2,m,h], [], [], [], [], [], [], [2,m,h] ],
	[ [1,m,h], [], [], [], [], [], [], [1,m,h] ],
	[ [], [], [], [], [], [], [], [] ],
	[ [2,m,h], [], [], [], [], [], [], [2,m,h] ],
	[ [1,m,h], [], [], [], [], [], [], [] ],
	[ [2,m,h], [], [], [], [], [], [], [] ],
	[ [], [1,m,v], [], [1,m,v], [], [2,m,v], [1,m,h], [] ] ], Board2, 1, d, 7),
	display_game(Board2).
test8:-
	use_module(library(lists)),
	initializeAI(4, Players),
	updatePlayers(2, Players, Players1),
	updatePlayers(3, Players1, Players2),
	updatePlayers(1, Players2, Players3),
	updatePlayers(2, Players3, Players4),
	updatePlayers(4, Players4, Players5),
	write(Players), nl,
	write(Players1), nl,
	write(Players2), nl,
	write(Players3), nl,
	write(Players4), nl,
	write(Players5), nl.

test9:-
	use_module(library(random)), nl, nl,
	%Number is bound to a random float between Lower and Upper. Upper will never be generated.
	random(1, 10, R1),
	write('Random number between 1-9: '), write(R1), nl,
	random(1, 10, R2),
	write('Random number between 1-9: '), write(R2), nl,
	random(1, 10, R3),
	write('Random number between 1-9: '), write(R3), nl.
pred(X, Y, List):-
	nth1(X, List, List2),
	nth1(Y, List2, player).
test10:-
	use_module(library(lists)),
	findall([X,Y], pred(X,Y,[[c,d],[],[1,a,c,player],[],[],[],[],[player,0,1],[],[]]), L),
	write(L).
pred2(X):-
	column(X,C),
	C < 5.
test11:-
	use_module(library(lists)),
	findall(X, pred2(X), L),
	write(L).
test12:-
	use_module(library(lists)),
	use_module(library(random)), nl, nl,
	getBoard(_, 3, Board),
	display_game(Board),
	choose_move(1, computer, Board, Row, Column, N_moves),
	write('Row: '), write(Row), write(', Column: '), write(Column), write(', Number of moves: '), write(N_moves), nl.
test13:-
	corner_moves([ [ [], [], [], [], [], [], [1,m,h], [] ],
			[ [2,m,h], [], [], [], [], [], [], [2,m,v] ],
			[ [1,m,h], [], [], [], [], [], [], [1,m,h] ],
			[ [2,m,h], [], [], [], [], [], [], [2,m,h] ],
			[ [2,m,h], [], [], [], [], [], [], [2,m,h] ],
			[ [1,m,h], [], [], [], [], [], [], [1,m,h] ],
			[ [2,m,h], [], [], [], [], [], [], [2,m,h] ],
			[ [], [1,m,h], [2,m,v], [1,m,v], [1,m,v], [2,m,v], [1,m,v], [] ] ],
				[[8,g,1],[7,a,1],[1,g,1],[7,h,1]], List),
	write(List).
test14:-
	use_module(library(lists)),
	getBoard(_, 2, Board),
	initializeAI(2, Players),
	display_game(Board),
	%trace,
	count_masters(1, Board, Players, [], List),
	write(List), nl,
	mostMasters(Board, Players, Winner),
	write(Winner), nl.
	
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                             TODO                                                      %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
